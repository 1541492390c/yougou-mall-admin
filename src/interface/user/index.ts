// 用户信息
interface User {
    userId?: string,
    nickname?: string,
    avatar?: string,
    age?: number,
    gender?: number,
    birthday?: Date
}

// 收获地址
interface Addr {
    addrId?: number,
    userId?: string,
    consignee: string,
    telephone: string,
    province?: string,
    city?: string,
    district?: string,
    detailedAddr?: string,
    isDefault: boolean
}

// 评分统计
interface RateStatistics {
    average: number,
    oneCount: number,
    twoCount: number,
    threeCount: number,
    fourCount: number,
    fiveCount: number
}

// 用户反馈
interface Feedback {
    feedbackId?: string,
    feedbackTypeId?: number,
    feedbackTypeName?: string,
    content?: string,
    imgList?: string
    contactWay: string,
}

// 用户评论
interface IComment {
    commentId?: number,
    userId?: string,
    productId?: string,
    orderId?: string,
    orderItemId?: number,
    rate?: number,
    imgList?: string,
    content: string,
    avatar?: string,
    nickname?: string,
    commentTime?: string
}

export type { User, Addr, RateStatistics, Feedback, IComment }