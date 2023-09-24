import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取订单分页信息
const getOrderPagesApi = (
    pageNum: number = 1,
    pageSize: number = 10,
    state: number | undefined = undefined,
    orderNo: string | undefined = undefined): Promise<AxiosResponse> => {
    return request({
        url: '/admin/order/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            state: state,
            orderNo: orderNo
        }
    }, true)
}

// 更新订单状态接口
const updateOrderStateApi = (orderId: number, state: number): Promise<AxiosResponse> => {
    return request({
        url: '/admin/order/delivery',
        method: 'PUT',
        params: {
            order_id: orderId,
            state: state
        }
    }, true)
}

export { getOrderPagesApi, updateOrderStateApi }