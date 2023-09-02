import { AxiosResponse } from 'axios'
import request from '@/request'
import { Category } from '@/interface/product'

// 获取分类列表接口
const getCategoryListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/list',
        method: 'GET'
    }, true)
}

// 添加分类接口
const saveCategoryApi = (value: { parentId: number, name: string }): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/category/save',
        method: 'POST',
        data: value
    }, true)
}

// 更新分类接口
const updateCategoryApi = (value: Category): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/category/update',
        method: 'PUT',
        data: value
    }, true)
}
// 删除分类接口
const deleteCategoryApi = (value: number): Promise<AxiosResponse> => {
    return request({
        url: '/admin/product/category/delete',
        method: 'DELETE',
        params: {category_id: value}
    }, true)
}


export { getCategoryListApi, saveCategoryApi, updateCategoryApi, deleteCategoryApi }