import { AxiosResponse } from 'axios'
import request from '@/request'

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

export { getBannerPagesApi }