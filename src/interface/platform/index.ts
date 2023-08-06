// 轮播图
interface Banner {
    bannerId: number,
    description?: string,
    link: string,
    img: string
}

// 用户反馈类型
interface FeedbackType {
    feedbackTypeId: number,
    name: string
}

export type { Banner, FeedbackType }