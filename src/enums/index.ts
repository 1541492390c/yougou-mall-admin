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
    PRODUCT = 4
}

export { ResponseCodeEnum, UploadFileTypeEnum }