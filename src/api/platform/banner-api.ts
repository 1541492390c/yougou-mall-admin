import { AxiosResponse } from 'axios'
import request from '@/request'
import { Banner } from '@/interface/platform'

// 获取轮播图分页信息接口
const getBannerPagesApi = (pageNum: number = 1, pageSize: number = 5): Promise<AxiosResponse> => {
    return request({
        url: '/admin/platform/banner/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

// 保存轮播图接口
const saveBannerApi = (value: Banner): Promise<AxiosResponse> => {
    return request({
        url: '/admin/platform/banner/save',
        method: 'POST',
        data: value
    }, true)
}

// 更新轮播图接口
const updateBannerApi = (value: Banner): Promise<AxiosResponse> => {
    return request({
        url: '/admin/platform/banner/update',
        method: 'PUT',
        data: value
    }, true)
}

export { getBannerPagesApi, saveBannerApi, updateBannerApi }