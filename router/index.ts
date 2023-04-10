//https://router.vuejs.org/zh/
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/library'},
    { name: "library", path: '/library', component: () => import('comps/Library.vue') },
    { name: "reader", path: '/reader/:name', component: () => import('comps/reader.vue'), props: true },
    { name: "test", path: '/test', component: () => import('comps/Test.vue') },
]

const router = createRouter({
    history: createWebHistory('/vue-reader'),
    routes,
})

export default router