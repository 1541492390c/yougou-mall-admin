// 优惠券
interface Coupon {
    couponId: string,
    quota: number,
    takeCount: number,
    expired: number,
    usedAmount: number,
    discountAmount: number,
    categoryNode: string,
    description: string
}

// 用户优惠券信息
interface CouponUser {
    couponUserId: number,
    couponId: string,
    state: number,
    receiveTime: Date,
    expiredTime: Date,
    coupon: Coupon
}

export type { Coupon, CouponUser }