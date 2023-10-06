// 认证授权账号信息
interface AuthAccount {
    authAccountId: number,
    userId: number,
    userType: number,
    username: string,
    mobile: string,
    email: string,
    role: string
}

export type { AuthAccount }