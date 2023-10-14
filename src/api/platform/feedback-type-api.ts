import { AxiosResponse } from 'axios'
import request from '@/request'
import { FeedbackType } from '@/interface/platform'

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

// 更新反馈类型接口
const updateFeedbackTypeApi = (value: FeedbackType): Promise<AxiosResponse> => {
    return request({
        url: '/admin/platform/feedback_type/update',
        method: 'PUT',
        data: value
    }, true)
}

// 删除反馈类型接口
const deleteFeedbackTypeApi = (id: number): Promise<AxiosResponse> => {
    return request({
        url: `/admin/platform/feedback_type/delete/${id}`,
        method: 'DELETE'
    }, true)
}

export { getFeedbackTypePagesApi, updateFeedbackTypeApi, deleteFeedbackTypeApi

}