import { AxiosResponse } from 'axios'
import request from '@/request'
import { Sku } from '@/interface/product'

// 获取sku分页信息接口
const getSkuPagesApi = (productId: number, pageNum: number = 1, pageSize: number = 5): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/sku/pages',
        method: 'GET',
        params: {
            product_id: productId,
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

// 更新sku接口
const updateSkuApi = (value: Sku): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/sku/update',
        method: 'PUT',
        data: value
    }, true)
}

export { getSkuPagesApi, updateSkuApi }