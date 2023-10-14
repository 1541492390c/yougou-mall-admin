// 响应码
enum ResponseCodeEnum {
    OK = '00000',
    // 未登录
    UN_LOGIN_ERROR = 'A0001',
    // 无效token
    UN_VALID_TOKEN_ERROR = 'A0003',
}

// 上传资源类型
enum UploadFileTypeEnum {
    // 商品资源
    PRODUCT = 4,
    // 品牌资源
    BRAND
}

// 用户类型
enum UserTypeEnum {
    // 管理员
    ADMIN = 1,
    // 普通用户
    USER
}

// 更新密码类型
enum UpdatePassTypeEnum {
    // 更新
    UPDATE = 2
}

export { ResponseCodeEnum, UploadFileTypeEnum, UserTypeEnum, UpdatePassTypeEnum }