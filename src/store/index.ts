import { createStore } from 'vuex'
import { User } from '@/interface/user'
import { getUserinfoApi } from '@/api/user/user-api'

const isLogin: boolean = false
const userinfo: User = {}

export default createStore({
    state: {
        isLogin,
        userinfo,
    },
    mutations: {
        SET_IS_LOGIN: (state, {payload}): void => {
            state.isLogin = payload
        },
        SET_USERINFO: (state, {payload}): void => {
            state.userinfo = payload
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
        }
    },
    getters: {
        userinfo: state => state.userinfo
    },
    modules: {}
})