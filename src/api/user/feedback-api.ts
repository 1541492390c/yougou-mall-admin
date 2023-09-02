import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取反馈分页信息接口
const getFeedbackPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/admin/user/feedback/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

export { getFeedbackPagesApi }