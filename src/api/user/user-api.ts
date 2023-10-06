import request from '@/request'
import { AxiosResponse } from 'axios'

// 添加管理员接口
const saveAdminApi = (value: { username: string, nickname: string, password: string, role: string }): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/save',
        method: 'POST',
        data: value
    }, true)
}

// 获取用户信息接口
const getUserinfoApi = (): Promise<AxiosResponse> => {
    return request({url: '/user/info', method: 'GET'}, true)
}

// 获取用户分页信息接口
const getUserPagesApi = (
    pageNum: number = 1,
    pageSize: number = 10,
    userType: number = 2,
    gender: number | undefined = undefined,
    state: number | undefined = undefined,
    nickname: string | undefined = undefined): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            user_type: userType,
            gender: gender,
            state: state,
            nickname: nickname
        }
    }, true)
}

// 获取用户总数接口
const getUserCountApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/count',
        method: 'GET'
    }, true)
}

// 获取用户统计信息接口
const getUserStatisticsApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/statistics',
        method: 'GET'
    }, true)
}

// 更新用户状态接口
const updateUserStateApi = (userId: number, state: number): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/update_state',
        method: 'PUT',
        params: {
            user_id: userId,
            state: state
        }
    }, true)
}

export { saveAdminApi, getUserinfoApi, getUserPagesApi, getUserCountApi, getUserStatisticsApi, updateUserStateApi }