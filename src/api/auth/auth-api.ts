import { AxiosResponse } from 'axios'
import request from '@/request'

// 登录接口
const loginApi = (username: string, password: string, code: string): Promise<AxiosResponse> => {
    return request({
        url: '/admin/auth//login',
        method: 'POST',
        params: {
            username: username,
            password: password,
            code: code
        }
    })
}

// 退出登录接口
const logoutApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/auth/logout',
        method: 'GET'
    })
}

// 更新密码接口
const updatePasswordApi = (updatePassword: { password: string, newPassword: string }): Promise<AxiosResponse> => {
    return request({
        url: '/auth/update_password',
        method: 'PUT',
        data: updatePassword
    }, true)
}

export { loginApi, logoutApi, updatePasswordApi }