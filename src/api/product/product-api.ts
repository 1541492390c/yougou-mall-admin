import { AxiosResponse } from 'axios'
import request from '@/request'
import { Product } from '@/interface/product'

// 获取商品分页信息接口
const getProductPagesApi = (pageNum: number = 1, pageSize: number = 10, isDiscount: boolean | undefined, recommended: boolean | undefined, categoryNode: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            is_discount: isDiscount,
            recommended: recommended,
            category_node: categoryNode
        }
    })
}

// 更新商品信息接口
const updateProductApi = (value: Product): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/update',
        method: 'PUT',
        data: value
    }, true)
}

export { getProductPagesApi, updateProductApi }