// 订单
interface Order {
    orderId?: string,
    userId?: string,
    state?: number,
    orderNo?: string,
    remark?: string,
    submitTime?: Date,
    cancelTime?: Date,
    payTime?: Date,
    deliveryTime?: Date,
    finishTime?: Date,
    orderAddr?: OrderAddr,
    orderItemList?: Array<OrderItem>
}

// 订单收货地址
interface OrderAddr {
    orderId: string,
    addrId: number,
    consignee: string,
    telephone: string,
    province: string,
    city: string,
    district: string,
    detailedAddr: string
}

// 订单项
interface OrderItem {
    orderId?: string,
    productId?: string,
    orderItemId?: number,
    skuId: number,
    quantity: number,
    totalAmount?: number,
    productName?: string,
    img?: string,
    specs?: string,
    isComment?: boolean
}

export type { Order, OrderAddr, OrderItem }