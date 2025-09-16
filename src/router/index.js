
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import OrderConfirmation from '@/views/OrderConfirmation.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/confirmation',
    name: 'OrderConfirmation',
    component: OrderConfirmation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
