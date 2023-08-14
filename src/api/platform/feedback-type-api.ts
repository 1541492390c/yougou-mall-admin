import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取反馈类型分页信息接口
const getFeedbackTypePagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/admin/platform/feedback_type/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

export { getFeedbackTypePagesApi }