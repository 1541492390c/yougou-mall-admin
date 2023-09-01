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
const getUserPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

// 获取用户反馈列表
const getFeedbackListApi = (): Promise<AxiosResponse> => {
    return request({url: '/admin/user/feedback/list', method: 'GET'}, true)
}

export { addAdminApi, getUserinfoApi, getUserPagesApi, getFeedbackListApi }