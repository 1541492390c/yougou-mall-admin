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

export type { Coupon }