<template>
  <div>
    <header>
      <h1>獨角獸的料理室</h1>
      <div class="cart-icon-container" @click="isCartOpen = true">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span v-if="cart.length > 0" class="cart-badge">{{ cart.length }}</span>
      </div>
    </header>

    <nav class="category-nav">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="handleScrollToCategory(category)"
      >
        {{ category }}
      </button>
    </nav>

    <main>
      <Menu 
        ref="menuComponent" 
        @select-item="openCustomizeModal" 
      />
    </main>

    <ItemCustomizationModal
      v-if="isCustomizeModalOpen"
      :item="selectedItem"
      :menu="allMenuItems"
      @close="isCustomizeModalOpen = false"
      @add-to-cart="addToCart"
    />

    <ShoppingCart
      v-if="isCartOpen"
      :cart="cart"
      @close="isCartOpen = false"
      @remove-from-cart="removeFromCart"
      @place-order="handlePlaceOrder"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import Menu from '@/components/Menu.vue';
import ItemCustomizationModal from '@/components/ItemCustomizationModal.vue';
import ShoppingCart from '@/components/ShoppingCart.vue';

const router = useRouter();
const orderStore = useOrderStore();

const isCustomizeModalOpen = ref(false);
const isCartOpen = ref(false);
const selectedItem = ref(null);
const allMenuItems = ref([]);
const cart = ref([]);

// --- Menu Navigation ---
const menuComponent = ref(null);
const categories = ['主餐', '沙拉', '配菜', '飲料'];

const handleScrollToCategory = (category) => {
  if (menuComponent.value) {
    menuComponent.value.scrollToCategory(category);
  }
};
// --- End Menu Navigation ---

const openCustomizeModal = (item, menu) => {
  selectedItem.value = item;
  allMenuItems.value = menu;
  isCustomizeModalOpen.value = true;
};

const addToCart = (item) => {
  cart.value.push(item);
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const handlePlaceOrder = (paymentMethod) => {
  const orderNumber = `ORDER-${Date.now()}`;
  orderStore.setOrder(cart.value, orderNumber, paymentMethod);
  cart.value = [];
  isCartOpen.value = false;
  router.push('/confirmation');
};

</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(224, 207, 252, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 8px rgba(255, 117, 168, 0.5);
}

.cart-icon-container {
  position: relative;
  cursor: pointer;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: var(--primary-color); /* Use theme color */
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  box-shadow: var(--primary-glow);
}

.category-nav {
  position: sticky;
  top: 65px; /* Adjust based on new header height */
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  padding: 0.75rem 2rem;
  border-bottom: 1px solid rgba(224, 207, 252, 0.4);
  z-index: 99;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.category-nav button {
  padding: 0.5rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-nav button:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: transparent;
  box-shadow: var(--primary-glow);
  transform: translateY(-2px);
}

main {
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
