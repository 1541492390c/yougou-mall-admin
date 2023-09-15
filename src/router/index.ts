import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/login/LoginView.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: {
            title: '控制台'
        },
        children: [
            // 首页
            {
                path: 'index',
                name: 'index',
                component: () => import('@/views/menus/index/IndexView.vue'),
                meta: {
                    title: '首页'
                }
            },
            // 用户管理
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/menus/user/UserView.vue'),
                meta: {
                    title: '用户管理'
                }
            },
            // 用户反馈
            {
                path: 'feedback',
                name: 'feedback',
                component: () => import('@/views/menus/feedback/FeedbackView.vue'),
                meta: {
                    title: '用户反馈'
                }
            },
            // 订单管理
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/menus/order/OrderView.vue'),
                meta: {
                    title: '订单管理'
                }
            },
            {
                path: 'product',
                name: 'product',
                component: () => import('@/views/menus/product/ProductView.vue'),
                meta: {
                    title: '商品管理'
                },
                children: [
                    // 商品-分类
                    {
                        path: 'category_management',
                        name: 'category_management',
                        component: () => import('@/views/menus/product/category-management/CategoryManagementView.vue'),
                        meta: {
                            title: '分类管理'
                        }
                    },
                    // 商品-品牌管理
                    {
                        path: 'brand_management',
                        name: 'brand_management',
                        component: () => import('@/views/menus/product/brand-management/BrandManagementView.vue'),
                        meta: {
                            title: '品牌管理'
                        }
                    },
                    // 商品-商品管理
                    {
                        path: 'product_management',
                        name: 'product_management',
                        component: () => import('@/views/menus/product/product-management/ProductManagementView.vue'),
                        meta: {
                            title: '商品管理'
                        }
                    },
                    // 商品-添加商品
                    {
                        path: 'add_product',
                        name: 'add_product',
                        component: () => import('@/views/menus/product/add-product/AddProductView.vue'),
                        meta: {
                            title: '添加商品'
                        }
                    },
                    // 商品-添加品牌
                    {
                        path: 'add_brand',
                        name: 'add_brand',
                        component: () => import('@/views/menus/product/add-brand/AddBrandView.vue'),
                        meta: {
                            title: '添加品牌'
                        }
                    }
                ]
            },
            {
                path: 'platform',
                name: 'platform',
                component: () => import('@/views/menus/platform/PlatformView.vue'),
                meta: {
                    title: '平台管理'
                },
                children: [
                    // 平台-轮播图管理
                    {
                        path: 'banner_management',
                        name: 'banner_management',
                        component: () => import('@/views/menus/platform/banner-management/BannerManagementView.vue'),
                        meta: {
                            title: '轮播图管理'
                        }
                    },
                    // 平台-反馈类型管理
                    {
                        path: 'feedback_type_management',
                        name: 'feedback_type_management',
                        component: () => import('@/views/menus/platform/feedback-type-management/FeedbackTypeManagementView.vue'),
                        meta: {
                            title: '反馈类型管理'
                        }
                    },
                    // 平台-添加轮播图
                    {
                        path: 'add_banner',
                        name: 'add_banner',
                        component: () => import('@/views/menus/platform/add-banner/AddBannerView.vue'),
                        meta: {
                            title: '添加轮播图'
                        }
                    },
                ]
            },
            // 财务管理
            {
                path: 'payment',
                name: 'payment',
                component: () => import('@/views/menus/payment/PaymentView.vue'),
                meta: {
                    title: '财务管理'
                },
                children: [
                    // 财务-优惠券管理
                    {
                        path: 'coupon_management',
                        name: 'coupon_management',
                        component: () => import('@/views/menus/payment/coupon-management/CouponManagementView.vue'),
                        meta: {
                            title: '优惠券管理'
                        }
                    },
                    // 财务-添加优惠券
                    {
                        path: 'add_coupon',
                        name: 'add_coupon',
                        component: () => import('@/views/menus/payment/add-coupon/AddCoupon.vue'),
                        meta: {
                            title: '添加优惠券'
                        }
                    }
                ]
            }
        ]
    }
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes
})

export default router