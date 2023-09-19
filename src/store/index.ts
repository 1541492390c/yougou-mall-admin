import { createStore } from 'vuex'
import { User } from '@/interface/user'
import { getUserinfoApi } from '@/api/user/user-api'
import { Category } from '@/interface/product'
import { getCategoryListApi } from '@/api/product/category-api'

const isLogin: boolean = false
const userinfo: User = {}
const categoryList: Array<Category> = []

export default createStore({
    state: {
        // 是否登录
        isLogin,
        // 用户信息
        userinfo,
        // 分类列表
        categoryList
    },
    mutations: {
        SET_IS_LOGIN (state, payload): void {
            state.isLogin = payload
        },
        SET_USERINFO (state, payload): void {
            state.userinfo = payload
        },
        SET_CATEGORY_LIST (state, payload): void {
            state.categoryList = payload
        }
    },
    actions: {
        getIsLogin: ({commit}): void => {
            let isLogin = !!localStorage.getItem('token')
            commit('SET_IS_LOGIN', isLogin)
        },
        getUserinfo: ({commit}): void => {
            getUserinfoApi().then((res): void => {
                if (res) {
                    commit('SET_USERINFO', res.data)
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        getCategoryList: ({commit}): void => {
            getCategoryListApi().then((res): void => {
                if (res) {
                    commit('SET_CATEGORY_LIST', res.data)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    getters: {
        userinfo: state => state.userinfo,
        categoryList: state => state.categoryList
    },
    modules: {}
})