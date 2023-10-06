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
const updatePasswordApi = (updatePassword: { updatePassType: number, password: string, newPassword: string }): Promise<AxiosResponse> => {
    return request({
        url: '/auth/update_password',
        method: 'PUT',
        data: updatePassword
    }, true)
}

// 更新管理员权限接口
const updateAdminRoleApi = (authAccountId: number | undefined, role: string): Promise<AxiosResponse> => {
    return request({
        url: '/admin/auth/update_role',
        method: 'PUT',
        params: {
            auth_account_id: authAccountId,
            role: role
        }
    }, true)
}

// 根据用户ID获取认证授权信息接口
const getAuthByUserIdApi = (userId: number): Promise<AxiosResponse> => {
    return request({
        url: '/admin/auth/get_by_user_id',
        method: 'GET',
        params: { user_id: userId }
    }, true)
}

export { loginApi, logoutApi, updatePasswordApi, updateAdminRoleApi, getAuthByUserIdApi }