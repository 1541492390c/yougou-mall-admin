import { AxiosResponse } from 'axios'
import request from '@/request'
import { Coupon } from '@/interface/payment'

// 保存优惠券接口
const saveCouponApi = (value: Coupon): Promise<AxiosResponse> => {
    return request({
        url: '/admin/payment/coupon/save',
        method: 'POST',
        data: value
    }, true)
}

// 获取优惠券分页信息
const getCouponPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/admin/payment/coupon/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

// 更新优惠券接口
const updateCouponApi = (value: Coupon): Promise<AxiosResponse> => {
    return request({
        url: '/admin/payment/coupon/update',
        method: 'PUT',
        data: value
    }, true)
}

// 删除优惠券接口
const deleteCouponApi = (value: number): Promise<AxiosResponse> => {
    return request({
        url: '/admin/payment/coupon/delete',
        method: 'DELETE',
        params: {coupon_id: value}
    }, true)
}

export { saveCouponApi, getCouponPagesApi, updateCouponApi, deleteCouponApi }