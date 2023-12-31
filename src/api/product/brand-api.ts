import { AxiosResponse } from 'axios'
import request from '@/request'
import { Brand } from '@/interface/product'

// 保存品牌接口
const saveBrandApi = (value: Brand): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/brand/save',
        method: 'POST',
        data: value
    }, true)
}

// 获取品牌列表接口
const getBrandListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/brand/list',
        method: 'GET'
    })
}

// 搜索品牌列表接口
const getBrandPagesApi = (
    pageNum: number = 1,
    pageSize: number = 10,
    categoryNode: string | undefined = undefined,
    name: string | undefined = undefined): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/brand/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            category_node: categoryNode,
            name: name
        }
    }, true)
}

// 更新品牌信息接口
const updateBrandApi = (value: Brand): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/brand/update',
        method: 'PUT',
        data: value
    }, true)
}

// 删除品牌信息接口
const deleteBrandApi = (id: number): Promise<AxiosResponse> => {
    return request({
        url: `/admin/product/brand/delete/${id}`,
        method: 'DELETE'
    }, true)
}

export { saveBrandApi, getBrandListApi, getBrandPagesApi, updateBrandApi, deleteBrandApi }