//https://router.vuejs.org/zh/
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    { name: "library", path: '/library', component: () => import('comps/Library.vue') },
    { name: "reader", path: '/reader/:id?/:name?', component: () => import('comps/Reader.vue'), props: true },
    { name: "test", path: '/test', component: () => import('comps/Test.vue') },
]

const router = createRouter({
    history: createWebHistory('/docs/'),
    routes,
})

export default router