import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
const routerFactory = () =>
  createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/CarManage/:id?',
        name: 'CarManage',
        props: true,
        component: () => import('../views/car/CarManage.vue')
      },
      {
        path: '/CarLog',
        name: 'CarLog',
        component: () => import('../views/car/CarLog.vue')
      },
      {
        path: '/RequestReview',
        name: 'RequestReview',
        component: () => import('../views/car/RequestReview.vue')
      },
      {
        path: '/RefreshPage',
        name: 'RefreshPage',
        component: Home
      },
      {
        path: '/:All(.*)*',
        name: 'Home',
        component: Home
      }
    ]
  })
export default routerFactory
