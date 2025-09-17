<!-- src/components/Menu.vue -->
<template>
    <div class="menu-container">
      <div 
        v-for="category in categories" 
        :key="category" 
        class="category-section"
        :ref="(el) => { if (el) categoryRefs[category] = el }"
      >
        <h2>{{ category }}</h2>
        <div class="menu-items-grid">
          <div v-for="item in getItemsByCategory(category)" :key="item.id" class="menu-item-card" @click="openModal(item)">
            <img :src="item.image" :alt="item.name" class="menu-item-image">
            <div class="menu-item-details">
                <div>
                    <h3>{{ item.name }}</h3>
                    <p class="item-ingredients" v-if="item.ingredients && item.ingredients.length">{{ item.ingredients.join(', ') }}</p>
                </div>
                <div class="details-footer">
                    <p class="item-price">NT${{ getDisplayPrice(item) }}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineExpose } from 'vue';
  
  const emit = defineEmits(['select-item']);

  // --- Expose scroll method ---
  const categoryRefs = ref({});
  const scrollToCategory = (category) => {
    const el = categoryRefs.value[category];
    if (el) {
      // Calculate the offset to account for the sticky header and nav
      const headerOffset = 130; // Approx height of header + new nav bar
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  defineExpose({
    scrollToCategory
  });
  // --- END Expose scroll method ---

  const allSideDishes = [
    { id: 6, name: '薯條', price: { medium: 45, large: 60 }, image: '/images/fries.png' },
    { id: 7, name: '洋蔥圈', price: { medium: 50, large: 65 }, image: '/images/onion-rings.png' },
    { id: 10, name: '薯餅', price: { medium: 35, large: 50 }, image: '/images/hashbrown.png' },
    { id: 11, name: '雞塊', price: { medium: 55, large: 70 }, image: '/images/nuggets.png' },
  ];

  const standardAvailableSets = [
    { id: 1, name: '套餐A', price: 50, contents: [ { category: '飲料', options: ['可樂', '冰茶'], default: '可樂' }, '薯條' ] },
    { id: 2, name: '套餐B', price: 65, contents: [ { category: '飲料', options: ['可樂', '冰茶'], default: '可樂' }, '雞塊' ] },
    { id: 3, name: '套餐C', price: 55, contents: [ { category: '飲料', options: ['可樂', '冰茶'], default: '可樂' }, '薯餅' ] },
  ];
  
  const menu = ref([
    // 主餐
    {
        id: 1,
        name: '牛肉漢堡',
        category: '主餐',
        price: 150,
        image: '/images/burger.png',
        ingredients: ['牛肉', '麵包', '生菜', '番茄'],
        availableSets: standardAvailableSets,
        sideDishes: allSideDishes,
        maxSideDishes: 2
    },
    {
        id: 2,
        name: '雞肉三明治',
        category: '主餐',
        price: 125,
        image: '/images/sandwich.png',
        ingredients: ['雞肉', '麵包', '生菜', '美乃滋'],
        availableSets: standardAvailableSets,
        sideDishes: allSideDishes,
        maxSideDishes: 2
    },
    {
        id: 3,
        name: '素食漢堡',
        category: '主餐',
        price: 135,
        image: '/images/veggie-burger.png',
        ingredients: ['素肉餅', '麵包', '生菜', '番茄'],
        availableSets: standardAvailableSets,
        sideDishes: allSideDishes,
        maxSideDishes: 2
    },
    {
        id: 4, 
        name: '海鮮義大利麵', 
        category: '主餐', 
        price: 220, 
        image: '/images/pasta.png', 
        ingredients: ['蝦', '蛤蜊', '番茄醬'], 
        availableSets: standardAvailableSets, 
        sideDishes: allSideDishes, 
        maxSideDishes: 2 
    },
    {
        id: 5, name: '凱薩沙拉', category: '沙拉', price: { medium: 120, large: 150 }, image: '/images/caesar.png', ingredients: ['蘿蔓', '麵包丁', '帕瑪森起司'], availableSets: [], sideDishes: [], maxSideDishes: 0
    },
    // 配菜
    { id: 6, name: '薯條', category: '配菜', price: { medium: 45, large: 60 }, image: '/images/fries.png', ingredients: ['馬鈴薯'], availableSets: [], sideDishes: [], maxSideDishes: 0 },
    { id: 7, name: '洋蔥圈', category: '配菜', price: { medium: 50, large: 65 }, image: '/images/onion-rings.png', ingredients: ['洋蔥', '麵糊'], availableSets: [], sideDishes: [], maxSideDishes: 0 },
    { id: 10, name: '薯餅', category: '配菜', price: { medium: 35, large: 50 }, image: '/images/hashbrown.png', ingredients: ['馬鈴薯'], availableSets: [], sideDishes: [], maxSideDishes: 0 },
    { id: 11, name: '雞塊', category: '配菜', price: { medium: 55, large: 70 }, image: '/images/nuggets.png', ingredients: ['雞肉'], availableSets: [], sideDishes: [], maxSideDishes: 0 },
    // 飲料
    { id: 8, name: '可樂', category: '飲料', price: { medium: 30, large: 40 }, image: '/images/coke.png', ingredients: [], availableSets: [], sideDishes: [], maxSideDishes: 0 },
    { id: 9, name: '冰茶', category: '飲料', price: { medium: 35, large: 45 }, image: '/images/iced-tea.png', ingredients: [], availableSets: [], sideDishes: [], maxSideDishes: 0 },
  ]);
  
  const categories = ['主餐', '沙拉', '配菜', '飲料'];
  
  const getItemsByCategory = (category) => {
    return menu.value.filter(item => item.category === category);
  };
  
  const getDisplayPrice = (item) => {
      if (typeof item.price === 'object') {
          return item.price.medium;
      }
      return item.price;
  }

  const openModal = (item) => {
    emit('select-item', item, menu.value); // Pass the whole menu
  };
  
  </script>
  
  <style scoped>
  .menu-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .category-section h2 {
    font-size: 1.8rem;
    color: var(--primary-color);
    text-shadow: 0 2px 4px rgba(255, 117, 168, 0.2);
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .menu-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  
  .menu-item-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: var(--shadow-deep);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .menu-item-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lifted), 0 0 20px rgba(160, 196, 255, 0.5); /* Lifted and secondary glow */
  }
  
  .menu-item-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .menu-item-details {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .menu-item-details h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: var(--text-color); /* As requested: Grayish color for item title */
  }

  .item-ingredients {
      font-size: 0.8rem;
      color: var(--text-color);
      opacity: 0.7;
      margin: 0 0 0.75rem;
      min-height: 3.2em; /* Reserve space for 3 lines */
  }

  .details-footer {
      border-top: 1px solid var(--accent-color);
      padding-top: 0.75rem;
      margin-top: auto;
  }
  
  .item-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color); /* As requested: Pink for price */
    text-shadow: 0 0 8px rgba(255, 117, 168, 0.5);
    margin: 0;
    text-align: right;
  }
  </style>
