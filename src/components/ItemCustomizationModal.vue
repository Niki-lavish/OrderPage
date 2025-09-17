<!-- src/components/ItemCustomizationModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">&times;</button>

      <img v-if="item" :src="item.image" :alt="item.name" class="modal-item-image" />

      <div class="modal-body">
        <h2>{{ item.name }}</h2>
        <p class="item-ingredients-display" v-if="item.ingredients && item.ingredients.length">{{ item.ingredients.join(', ') }}</p>

        <!-- ===== V-IF isSingleItem: Simple Size Selection UI ===== -->
        <div v-if="isSingleItem" class="options-section">
          <h4>選擇份量</h4>
          <div class="selection-group">
            <div 
              class="selection-tag"
              :class="{ active: selectedSize === 'medium' }"
              @click="selectedSize = 'medium'"
            >
              <span>中份</span>
              <span class="price-tag">NT${{ item.price.medium }}</span>
            </div>
            <div 
              class="selection-tag"
              :class="{ active: selectedSize === 'large' }"
              @click="selectedSize = 'large'"
            >
              <span>大份</span>
              <span class="price-tag">NT${{ item.price.large }}</span>
            </div>
          </div>
        </div>

        <!-- ===== V-ELSE: Original Complex UI for Main Courses ===== -->
        <template v-else>
          <!-- 套餐選擇 (卡片式) -->
          <div class="options-section" v-if="item.availableSets && item.availableSets.length > 0">
            <h4>選擇套餐</h4>
            <div class="set-card-group">
              <div
                v-for="set in item.availableSets"
                :key="set.id"
                class="set-card"
                :class="{ active: selectedSet && selectedSet.id === set.id }"
                @click="selectSet(set)"
              >
                <div class="set-card-header">
                  <span class="set-card-name">{{ set.name }}</span>
                  <span class="set-card-price">+NT${{ set.price }}</span>
                </div>
                <div class="set-card-content">
                  {{ formatSetContents(set.contents) }}
                </div>
              </div>
            </div>
            
            <!-- 套餐內容客製化 -->
            <div v-if="selectedSet" class="customization-area">
              <!-- 飲料選擇 -->
              <template v-for="cat in setDrinkCategories" :key="cat.category">
                  <h5>選擇{{ cat.category }}</h5>
                  <div class="selection-group">
                      <div
                          v-for="drinkName in cat.options"
                          :key="drinkName"
                          class="selection-tag"
                          :class="{ active: selectedDrinks[cat.category] === drinkName }"
                          @click="selectDrink(cat.category, drinkName)"
                      >
                        <span>{{ drinkName }}</span>
                        <span v-if="getDrinkPriceDifference(cat.default, drinkName) > 0" class="price-tag">+NT${{ getDrinkPriceDifference(cat.default, drinkName) }}</span>
                      </div>
                  </div>
              </template>

              <!-- 套餐升級 -->
              <h5 v-if="setDetailedContents.some(c => isUpgradable(c.name))">套餐升級</h5>
              <div class="selection-group">
                  <template v-for="content in setDetailedContents" :key="content.name">
                      <div
                          v-if="isUpgradable(content.name)"
                          class="selection-tag upgrade-tag"
                          :class="{ active: setUpgrade[content.name] }"
                          @click="toggleUpgrade(content.name)"
                      >
                          <span>{{ content.name }} 升級大份</span>
                          <span class="price-tag">+NT${{ getUpgradePrice(content.name) }}</span>
                      </div>
                  </template>
              </div>
            </div>
          </div>

          <!-- 附餐選擇 -->
          <div class="options-section" v-if="item.sideDishes && item.sideDishes.length > 0">
            <h4>加選附餐 (最多 {{ item.maxSideDishes }} 樣)</h4>
            <div v-for="side in item.sideDishes" :key="side.id" class="option-block">
              <span>{{ side.name }}</span>
              <div class="actions">
                  <template v-if="typeof side.price === 'object'">
                      <button @click="toggleSide(side, 'medium')" :class="{ active: isSideActive(side, 'medium') }" :disabled="isSideDishSelectionDisabled(side)">中 (+NT${{ side.price.medium }})</button>
                      <button @click="toggleSide(side, 'large')" :class="{ active: isSideActive(side, 'large') }" :disabled="isSideDishSelectionDisabled(side)">大 (+NT${{ side.price.large }})</button>
                  </template>
                  <template v-else>
                      <button @click="toggleSide(side, 'default')" :class="{ active: isSideActive(side, 'default') }" :disabled="isSideDishSelectionDisabled(side)">加入 (+NT${{ side.price }})</button>
                  </template>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="modal-footer">
        <div class="quantity-adjuster">
          <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity">+</button>
        </div>
        <div class="total-price">
          總計: <span>NT${{ totalPrice.toFixed(0) }}</span>
        </div>
        <div class="actions">
          <button class="btn-confirm" @click="handleAddToCart">加入購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  item: { type: Object, required: true },
  menu: { type: Array, required: true },
});

const emit = defineEmits(['close', 'add-to-cart']);

// --- State ---
const quantity = ref(1);
const selectedSet = ref(null);
const selectedDrinks = ref({});
const setUpgrade = ref({});
const selectedSides = ref([]);
const selectedSize = ref('medium'); // For single items with size options

// --- Computed Properties ---

// Determines if the item is a non-main course with size options
const isSingleItem = computed(() => {
  return props.item.category !== '主餐' && typeof props.item.price === 'object';
});

const totalPrice = computed(() => {
  let singleItemPrice = 0;

  if (isSingleItem.value) {
    // --- Calculation for Single Items (e.g., Fries, Salad) ---
    singleItemPrice = props.item.price[selectedSize.value] || 0;

  } else {
    // --- Calculation for Main Courses ---
    singleItemPrice = props.item.price;

    // Add set price
    if (selectedSet.value) {
      singleItemPrice += selectedSet.value.price;

      // Add price difference for selected drinks
      setDrinkCategories.value.forEach(cat => {
          const selected = selectedDrinks.value[cat.category];
          if (selected) {
              singleItemPrice += getDrinkPriceDifference(cat.default, selected);
          }
      });

      // Add set upgrade prices
      for (const itemName in setUpgrade.value) {
        if (setUpgrade.value[itemName]) {
          singleItemPrice += getUpgradePrice(itemName);
        }
      }
    }

    // Add side dish prices
    selectedSides.value.forEach(side => {
      singleItemPrice += side.price;
    });
  }

  return singleItemPrice * quantity.value;
});

// --- Watchers ---
watch(() => props.item, () => {
  // Reset state when item changes
  quantity.value = 1;
  selectedSet.value = null;
  selectedDrinks.value = {};
  setUpgrade.value = {};
  selectedSides.value = [];
  selectedSize.value = 'medium'; // Reset to default
}, { immediate: true });

watch(selectedSet, (newSet, oldSet) => {
  if (newSet?.id !== oldSet?.id) {
    setUpgrade.value = {};
    selectedDrinks.value = {};
    // Initialize with default drinks when a new set is selected
    if (newSet) {
        setDrinkCategories.value.forEach(cat => {
            selectedDrinks.value[cat.category] = cat.default;
        });
    }
  }
});

// --- Helper & Formatting Functions ---
const findMenuItem = (name) => {
  return props.menu.find(item => item.name === name);
};

const getMenuItemPrice = (itemName, size = 'medium') => {
    const item = findMenuItem(itemName);
    if (!item) return 0;
    if (typeof item.price === 'object') {
        return item.price[size] || 0;
    }
    return item.price; // For items with a single price
}

const formatSetContents = (contents) => {
    return contents.map(c => typeof c === 'string' ? c : c.category).join(', ');
};

// --- Computed Properties for UI Logic (for Main Courses) ---
const setDrinkCategories = computed(() => {
    if (!selectedSet.value) return [];
    return selectedSet.value.contents.filter(c => typeof c === 'object');
});

const setDetailedContents = computed(() => {
    if (!selectedSet.value) return [];
    return selectedSet.value.contents.map(content => {
        if (typeof content === 'string') {
            return { name: content, isDrink: false };
        }
        const selected = selectedDrinks.value[content.category];
        return { name: selected, isDrink: true };
    });
});

const getDrinkPriceDifference = (defaultDrink, selectedDrink) => {
    if (defaultDrink === selectedDrink) return 0;
    const defaultPrice = getMenuItemPrice(defaultDrink, 'medium');
    const selectedPrice = getMenuItemPrice(selectedDrink, 'medium');
    return selectedPrice - defaultPrice;
};

const isUpgradable = (itemName) => {
  const menuItem = findMenuItem(itemName);
  return menuItem && typeof menuItem.price === 'object';
};

const getUpgradePrice = (itemName) => {
  if (!isUpgradable(itemName)) return 0;
  return getMenuItemPrice(itemName, 'large') - getMenuItemPrice(itemName, 'medium');
};

const isSideActive = (side, size) => {
    return selectedSides.value.some(s => s.id === side.id && s.size === size);
};

const isSideDishSelectionDisabled = (side) => {
  const isSelected = selectedSides.value.some(s => s.id === side.id);
  return !isSelected && selectedSides.value.length >= props.item.maxSideDishes;
};

// --- Methods ---
const increaseQuantity = () => { quantity.value++; };
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value--; };

const selectSet = (set) => {
    if (selectedSet.value?.id === set.id) {
        selectedSet.value = null;
    } else {
        selectedSet.value = set;
    }
};

const selectDrink = (category, drinkName) => {
    const oldDrink = selectedDrinks.value[category];
    if (oldDrink && oldDrink !== drinkName) {
        setUpgrade.value[oldDrink] = false;
    }
    selectedDrinks.value[category] = drinkName;
};

const toggleUpgrade = (itemName) => {
    setUpgrade.value[itemName] = !setUpgrade.value[itemName];
};

const toggleSide = (side, size) => {
    const existingSideIndex = selectedSides.value.findIndex(s => s.id === side.id);
    if (existingSideIndex !== -1) {
        if (selectedSides.value[existingSideIndex].size === size) {
            selectedSides.value.splice(existingSideIndex, 1);
        } else {
            selectedSides.value[existingSideIndex].size = size;
            selectedSides.value[existingSideIndex].price = size === 'default' ? side.price : side.price[size];
        }
    } else {
        if (selectedSides.value.length < props.item.maxSideDishes) {
            selectedSides.value.push({ id: side.id, name: side.name, size: size, price: size === 'default' ? side.price : side.price[size] });
        }
    }
};

const handleAddToCart = () => {
  let finalSelectedSet = null;
  if (selectedSet.value) {
    finalSelectedSet = {
      ...selectedSet.value,
      contents: setDetailedContents.value.map(content => ({
          name: content.name,
          size: setUpgrade.value[content.name] ? 'large' : 'medium',
      }))
    };
  }

  const cartItem = {
    ...props.item,
    finalPrice: totalPrice.value,
    quantity: quantity.value,
    size: isSingleItem.value ? selectedSize.value : null, // Add size for single items
    selectedSet: finalSelectedSet,
    selectedSides: selectedSides.value,
    cartId: `${Date.now()}-${props.item.id}`
  };
  emit('add-to-cart', cartItem);
  emit('close');
};

</script>

<style scoped>
/* --- Base & Layout --- */
.modal-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center; 
  z-index: 1000; 
}
.modal-content { 
  position: relative; 
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 20px; 
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 90%; max-width: 500px; max-height: 90vh; 
  display: flex; flex-direction: column; 
  overflow: hidden;
  box-shadow: var(--shadow-lifted);
}
.close-button { 
  position: absolute; top: 15px; right: 15px; 
  background: rgba(0,0,0,0.1); border-radius: 50%;
  border: none; 
  width: 30px; height: 30px; line-height: 30px;
  font-size: 1.5rem; cursor: pointer; 
  color: #fff;
  text-align: center;
  transition: all 0.2s ease;
}
.close-button:hover { background: rgba(0,0,0,0.3); }

.modal-item-image { width: 100%; height: 200px; object-fit: cover; }

.modal-body { padding: 1rem 2rem; overflow-y: auto; }
.modal-body h2 { margin-top: 0; color: var(--text-color); text-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.item-ingredients-display { font-size: 0.9rem; color: var(--text-color); margin-top: -0.5rem; margin-bottom: 1rem; opacity: 0.8; }
.options-section h4 { 
  margin: 1.5rem 0 1rem; font-size: 1.1rem; 
  border-bottom: 1px solid var(--accent-color);
  padding-bottom: 0.5rem; 
  color: var(--text-color); /* As requested: Gray */
}
.customization-area h5 { margin: 1.5rem 0 0.75rem; font-size: 1rem; color: var(--text-color); }

.modal-footer { 
  display: flex; justify-content: space-between; align-items: center; 
  padding: 1rem 2rem; 
  border-top: 1px solid var(--accent-color);
  background: rgba(255, 255, 255, 0.5);
}

/* --- Interactive Elements Styling --- */
.selection-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* As requested: Add gap between selection tags */
}

.set-card-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; }
.set-card, .selection-tag {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease-in-out;
}
.selection-tag { padding: 0.5rem 1rem; border-radius: 20px; }

.set-card:hover, .selection-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(160, 196, 255, 0.6); /* Sky Blue Glow */
  border-color: var(--secondary-color);
}

.set-card.active, .selection-tag.active {
  background: var(--accent-color); /* Very pale pink */
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 15px rgba(255, 117, 168, 0.5); /* Primary glow */
  transform: translateY(-2px) scale(1.02);
}

.set-card-header { margin-bottom: 0.5rem; }
.set-card-name { font-weight: 600; }
.set-card-content { font-size: 0.8rem; color: #3e3c42; opacity: 0.7; }
.set-card.active .set-card-content { color: var(--primary-color); opacity: 0.9;}
.selection-tag .price-tag, .set-card-price { margin-left: 0.5rem; opacity: 0.8;}
.set-card.active .price-tag, 
.selection-tag.active .price-tag, 
.set-card.active .set-card-price,
.set-card.active .set-card-name,
.selection-tag.active span {
  color: var(--primary-color);
  opacity: 1;
  text-shadow: none;
}

/* --- Side Dish Section --- */
.option-block { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
.option-block .actions button {
  margin-left: 0.5rem; border: 1px solid var(--accent-color); 
  background: rgba(255, 255, 255, 0.4); 
  padding: 0.3rem 0.8rem; border-radius: 8px; cursor: pointer;
  transition: all 0.2s ease;
}
.option-block .actions button:hover:not(:disabled) { 
  background: var(--secondary-color);
  border-color: var(--secondary-color);
  color: white;
}
.option-block .actions button.active { 
  background: var(--accent-color); 
  border-color: var(--primary-color);
  color: var(--primary-color); 
  box-shadow: 0 0 10px rgba(255, 117, 168, 0.4);
}
.option-block .actions button:disabled { background-color: rgba(200,200,200,0.2); color: rgba(0,0,0,0.3); cursor: not-allowed; }

/* --- Footer Elements --- */
.quantity-adjuster button {
  width: 30px; height: 30px; border-radius: 50%; 
  border: 1px solid var(--accent-color); 
  background: rgba(255, 255, 255, 0.5);
  font-size: 1rem; cursor: pointer;
  transition: all 0.2s ease;
}
.quantity-adjuster button:hover:not(:disabled) { 
  background: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}
.quantity-adjuster span { margin: 0 0.5rem; font-size: 1.2rem; font-weight: 700; }
.total-price span { font-size: 1.5rem; font-weight: bold; color: var(--primary-color); text-shadow: 0 0 8px rgba(255, 117, 168, 0.5); }

.btn-confirm {
  /* Inherits from .btn-primary in App.vue */
  background: linear-gradient(45deg, var(--primary-color), #ff8ab4);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-deep);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.btn-confirm:hover, .btn-confirm:focus {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lifted), var(--primary-glow);
}

</style>
