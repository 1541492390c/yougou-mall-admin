import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取分类列表
const getCategoryListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/list',
        method: 'GET',
    }, true)
}

export { getCategoryListApi }