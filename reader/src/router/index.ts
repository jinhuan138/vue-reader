// https://router.vuejs.org/zh/
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/index.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'home' },
      },
      {
        name: 'home',
        path: 'home',
        component: () => import('../components/Home.vue'),
      },
      {
        name: 'view',
        path: 'view',
        component: () => import('../components/Reader.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
