import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: null,
    orderNumber: null,
    paymentMethod: null,
  }),
  actions: {
    setOrder(cart, orderNumber, paymentMethod) {
      // 使用深拷貝(deep copy)來確保所有巢狀資料都被完整複製
      // 這能防止在頁面跳轉後，Vue 的響-應式代理(Proxy)物件丟失深層資料
      this.order = JSON.parse(JSON.stringify(cart));
      this.orderNumber = orderNumber;
      this.paymentMethod = paymentMethod;
    },
    clearOrder() {
        this.order = null;
        this.orderNumber = null;
        this.paymentMethod = null;
    }
  },
});
