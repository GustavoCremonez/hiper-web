import { createRouter, createWebHistory } from 'vue-router'
import OrderListView from '../features/orders/views/OrderListView.vue'
import OrderCreateView from '../features/orders/views/OrderCreateView.vue'
import OrderDetailsView from '../features/orders/views/OrderDetailsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'orders',
      component: OrderListView
    },
    {
      path: '/orders/new',
      name: 'orders-create',
      component: OrderCreateView
    },
    {
      path: '/orders/:id',
      name: 'orders-details',
      component: OrderDetailsView
    }
  ]
})

export default router
