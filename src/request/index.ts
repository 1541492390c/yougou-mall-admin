import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ResponseCodeEnum } from '@/enums'
import { ElMessage } from 'element-plus'

export const baseUrl: string = import.meta.env.VITE_APP_BASE_API

const request = (config: AxiosRequestConfig, auth: boolean = false): Promise<AxiosResponse> => {
    const instance: AxiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 5000
    })

    // 请求拦截器
    instance.interceptors.request.use((config: InternalAxiosRequestConfig): any => {
        if (auth && !!localStorage.getItem('token')) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        }
        return config
    })

    // 响应拦截器
    instance.interceptors.response.use((res: AxiosResponse): any => {
        if (res.data.code === ResponseCodeEnum.OK) {
            return res.data
        } else if (res.data.code === ResponseCodeEnum.UN_VALID_TOKEN_ERROR || res.data.code === ResponseCodeEnum.UN_LOGIN_ERROR || res.data.code === ResponseCodeEnum.TOKEN_EXPIRED_ERROR) {
            localStorage.removeItem('token')
            ElMessage.error(res.data.message)
            // 跳转到登录页面
            window.location.href = '/'
        } else {
            ElMessage.error(res.data.message)
        }
    })

    return instance(config)
}

export default request