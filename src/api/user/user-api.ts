import request from '@/request'
import { AxiosResponse } from 'axios'
import { User } from '@/interface/user'

// 添加管理员接口
const addAdminApi = (user: User): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/save',
        method: 'POST',
        data: user
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
    gender: number | undefined = undefined,
    state: number | undefined = undefined,
    nickname: string | undefined = undefined): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            gender: gender,
            state: state,
            nickname: nickname
        }
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

export { addAdminApi, getUserinfoApi, getUserPagesApi, updateUserStateApi }