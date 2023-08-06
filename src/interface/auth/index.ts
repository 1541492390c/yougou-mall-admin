// 认证授权账号信息
interface AuthAuthAccount {
    authAccountId: string,
    userId: string,
    userType: number,
    username: string,
    mobile: string,
    email: string,
    role: string
}

export type { AuthAuthAccount }