<template>
  <div class="modal-overlay" @click.self="closeCart">
    <div class="cart-modal">
      <button class="close-button" @click="closeCart">&times;</button>
      <h2>您的購物車</h2>
      <div v-if="cart.length === 0" class="empty-cart">
        <p>您的購物車是空的。</p>
      </div>
      <div v-else>
        <div class="cart-items">
          <div v-for="(item, index) in cart" :key="item.cartId" class="cart-item">
            <div class="item-info">
              <h4>
                <span class="item-number">{{ index + 1 }}.</span>
                {{ item.quantity }}x {{ item.name }}
                <span v-if="item.size" class="size-indicator">({{ formatSize(item.size) }})</span>
              </h4>
              <div v-if="item.selectedSet" class="item-customization">
                <strong>{{ item.selectedSet.name }}:</strong>
                <ul class="customization-ul">
                  <li v-for="(content, c_index) in item.selectedSet.contents" :key="c_index">
                    {{ content.name }} <span class="size-indicator">({{ formatSize(content.size) }})</span>
                  </li>
                </ul>
              </div>
              <div v-if="item.selectedSides && item.selectedSides.length" class="item-customization">
                <strong>加選附餐:</strong>
                <ul class="customization-ul">
                  <li v-for="(side, s_index) in item.selectedSides" :key="s_index">
                      {{ side.name }} <span class="size-indicator">({{ formatSize(side.size) }})</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="item-actions">
              <span>NT${{ item.finalPrice.toFixed(0) }}</span>
              <button @click="removeFromCart(index)" class="remove-btn" title="移除商品">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="payment-options">
          <h3>付款方式</h3>
          <div>
            <label><input type="radio" v-model="paymentMethod" value="Online" @change="onlinePaymentType = null"> 線上支付</label>
            <div v-if="paymentMethod === 'Online'" class="online-payment-types">
                <label><input type="radio" v-model="onlinePaymentType" value="Credit Card"> 信用卡</label>
                <label><input type="radio" v-model="onlinePaymentType" value="E-payment"> 電子支付</label>
            </div>
            <label><input type="radio" v-model="paymentMethod" value="In-Store" @change="onlinePaymentType = null"> 臨櫃付款</label>
          </div>
        </div>

        <div class="cart-total">
            <strong>總計: NT${{ total.toFixed(0) }}</strong>
        </div>

        <button 
          class="place-order-btn" 
          @click="placeOrder" 
          :disabled="isPlaceOrderDisabled"
        >
          下單
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  cart: Array,
});

const emit = defineEmits(['remove-from-cart', 'place-order', 'close']);

const paymentMethod = ref(null);
const onlinePaymentType = ref(null);

const total = computed(() =>
  props.cart.reduce((acc, item) => acc + item.finalPrice, 0)
);

const formatSize = (size) => {
    switch (size) {
        case 'medium': return '中';
        case 'large': return '大';
        case 'default': return '標準';
        default: return size;
    }
};

const isPlaceOrderDisabled = computed(() => {
  if (!paymentMethod.value) return true;
  if (paymentMethod.value === 'Online' && !onlinePaymentType.value) return true;
  return false;
});

const removeFromCart = (index) => {
  emit('remove-from-cart', index);
};

const placeOrder = () => {
  if (isPlaceOrderDisabled.value) return;
  let finalPaymentMethod = paymentMethod.value === 'Online' ? onlinePaymentType.value : paymentMethod.value;
  emit('place-order', finalPaymentMethod);
};

const closeCart = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.cart-modal { background: white; padding: 2rem; border-radius: 10px; width: 90%; max-width: 450px; max-height: 90vh; display: flex; flex-direction: column; }
.close-button { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 2rem; cursor: pointer; color: #aaa; }
.cart-modal h2 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
.empty-cart { text-align: center; padding: 2rem 0; }
.cart-items { overflow-y: auto; max-height: 50vh; }
.cart-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 1rem 0; border-bottom: 1px solid #eee; }
.item-info h4 { margin: 0 0 0.5rem; }
.item-number {
  font-weight: bold;
  color: #f57c00;
  margin-right: 0.5rem;
}
.item-actions { display: flex; align-items: center; gap: 1rem; }
.item-actions span { font-weight: bold; }
.remove-btn { background: none; border: none; color: #f00; cursor: pointer; padding: 0; }
.item-customization { font-size: 0.9rem; color: #555; margin-left: 1.5rem; }
.customization-ul { list-style-type: none; padding-left: 0; margin: 0.25rem 0 0; }
.customization-ul li { margin-bottom: 0.25rem; padding-left: 1rem; position: relative; }
.customization-ul li::before { content: '•'; color: #f57c00; position: absolute; left: 0; top: 0; }
.size-indicator { color: #555; }

.payment-options { margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem; }
.payment-options h3 { margin: 0 0 0.5rem; }
.payment-options label { display: block; margin-bottom: 0.5rem; }
.online-payment-types { padding-left: 2rem; }

.cart-total { text-align: right; margin-top: 1rem; font-size: 1.2rem; }
.place-order-btn { width: 100%; padding: 1rem; margin-top: 1rem; background-color: #f57c00; color: white; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer; }
.place-order-btn:disabled { background-color: #ccc; }
</style>
