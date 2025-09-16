<template>
  <div class="confirmation-page">
    <div class="confirmation-card">
      <h2>訂單已確認！</h2>
      <p class="order-number">訂單編號: <strong>{{ orderStore.orderNumber }}</strong></p>

      <div class="order-summary">
        <h3>您的訂單</h3>
        <div v-for="(item, index) in orderStore.order" :key="index" class="order-item">
          <div class="item-info">
            <span class="item-index">{{ index + 1 }}.</span>
            <div class="item-details">
              <span class="item-name">{{ item.name }}</span>
              <div v-if="item.set" class="item-customization">
                <strong>套餐:</strong> {{ item.set.name }}
              </div>
              <div v-if="item.sides && item.sides.length" class="item-customization">
                <strong>配菜:</strong>
                <ul>
                  <li v-for="side in item.sides" :key="side.id">{{ side.name }}</li>
                </ul>
              </div>
            </div>
          </div>
          <span class="item-price">NT${{ (item.finalPrice || item.price).toFixed(0) }}</span>
        </div>
        <div class="order-total">
          <strong>總計: NT${{ total.toFixed(0) }}</strong>
        </div>
      </div>

      <div class="payment-info">
        <h3>付款資訊</h3>
        <p>
          付款方式: <strong>{{ orderStore.paymentMethod }}</strong>
          <span v-if="orderStore.paymentMethod === 'In-Store'" class="payment-instruction">
            (請於櫃檯付款)
          </span>
        </p>
      </div>

      <button @click="goHome" class="home-button">返回主選單</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const router = useRouter();

const total = computed(() => {
  if (!orderStore.order) return 0;
  return orderStore.order.reduce((acc, item) => acc + (item.finalPrice || item.price), 0);
});

const goHome = () => {
  orderStore.clearOrder();
  router.push('/');
};
</script>

<style scoped>
.confirmation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.confirmation-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
}

h2 {
  color: #2ecc71;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.order-number {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
}

.order-summary, .payment-info {
  text-align: left;
  margin-bottom: 2rem;
  border: 1px solid #eee;
  padding: 1.5rem;
  border-radius: 10px;
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-of-type {
  border-bottom: none;
}

.item-info {
  display: flex;
  gap: 1rem;
}

.item-index {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
  padding-top: 0.1em;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.item-customization {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
}

.item-customization ul {
  list-style-type: none;
  padding-left: 1rem;
  margin: 0.25rem 0 0;
}

.item-price {
  font-weight: bold;
  white-space: nowrap;
}

.order-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  text-align: right;
  font-size: 1.2rem;
}

.payment-instruction {
  font-style: italic;
  color: #e74c3c;
  margin-left: 0.5rem;
}

.home-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #2980b9;
}
</style>
