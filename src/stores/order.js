
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: null,
    orderNumber: null,
    paymentMethod: null,
  }),
  actions: {
    setOrder(cart, orderNumber, paymentMethod) {
      this.order = [ ...cart ];
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
