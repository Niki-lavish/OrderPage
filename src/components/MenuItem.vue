<template>
  <div class="menu-item" @click="openCustomization">
    <div class="item-image-container">
      <img :src="item.image" :alt="item.name" />
      <div v-if="quantity > 0" class="quantity-badge">{{ quantity }}</div>
    </div>
    <div class="item-info">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
      <span>${{ item.price.toFixed(2) }}</span>
    </div>
    <button>Customize</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: Object,
  quantity: Number,
});

const emit = defineEmits(['customize-item']);

const openCustomization = () => {
  emit('customize-item', props.item);
};
</script>

<style scoped>
.menu-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.item-image-container {
  position: relative;
}

.menu-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.quantity-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f57c00;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.item-info {
  padding: 1rem;
}

.item-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.item-info p {
  margin: 0 0 1rem;
  color: #666;
}

.item-info span {
  font-weight: bold;
  color: #f57c00;
}

button {
  background-color: #f57c00;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e67e22;
}
</style>
