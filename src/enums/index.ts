// 响应码
enum ResponseCodeEnum {
    OK = '00000',
    // 未登录
    UN_LOGIN_ERROR = 'A0001',
    // 无效token
    UN_VALID_TOKEN_ERROR = 'A0003',
}

// 轮播图类型
enum BannerTypeEnum {
    PC = 1
}

// 收获地址对话框类型
enum AddrModalTypeEnum {
    ADD = 1,
    UPDATE
}

// 上传资源类型
enum UploadFileTypeEnum {
    AVATAR = 1,
    FEEDBACK,
    COMMENT
}

export { ResponseCodeEnum, BannerTypeEnum, AddrModalTypeEnum, UploadFileTypeEnum }