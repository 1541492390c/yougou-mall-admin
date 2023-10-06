import { AxiosResponse } from 'axios'
import request from '@/request'
import { Product } from '@/interface/product'

// 保存商品接口
const saveProductApi = (value: any): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/save',
        method: 'POST',
        data: value
    }, true)
}

// 获取商品分页信息接口
const getProductPagesApi = (
    pageNum: number = 1,
    pageSize: number = 10,
    isDiscount: boolean | undefined = undefined,
    recommended: boolean | undefined = undefined,
    name: string | undefined = undefined,
    categoryNode: string | undefined = undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            is_discount: isDiscount,
            recommended: recommended,
            name: name,
            category_node: categoryNode
        }
    })
}

// 获取订单总数接口
const getProductCountApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/count',
        method: 'GET'
    }, true)
}

// 更新商品信息接口
const updateProductApi = (value: Product): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/update',
        method: 'PUT',
        data: value
    }, true)
}

// 删除商品信息接口
const deleteProductApi = (value: number): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/delete',
        method: 'DELETE',
        params: {product_id: value}
    }, true)
}

export { saveProductApi, getProductPagesApi, getProductCountApi, updateProductApi, deleteProductApi }