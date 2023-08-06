import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取品牌列表
const getBrandPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/product/brand/list',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

export {getBrandPagesApi}