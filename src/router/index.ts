import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/login/LoginView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        children: [
            // 首页
            {
                path: 'index',
                name: 'index',
                component: () => import('@/views/menus/index/IndexView.vue')
            },
            // 用户
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/menus/user/UserView.vue')
            },
            // 用户反馈
            {
                path: 'feedback',
                name: 'feedback',
                component: () => import('@/views/menus/feedback/FeedbackView.vue')
            },
            // 订单
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/menus/order/OrderView.vue')
            },
            // 商品-分类
            {
                path: 'category',
                name: 'category',
                component: () => import('@/views/menus/product/CategoryView.vue')
            },
            // 商品-品牌
            {
                path: 'brand',
                name: 'brand',
                component: () => import('@/views/menus/product/BrandView.vue')
            },
            // 商品-商品
            {
                path: 'product',
                name: 'product',
                component: () => import('@/views/menus/product/ProductView.vue')
            }
        ]
    }
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes
})

export default router