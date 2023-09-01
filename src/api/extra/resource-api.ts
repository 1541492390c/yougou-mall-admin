import { AxiosResponse } from 'axios'
import request from '@/request'

// 上传文件接口
const uploadFileApi = (value: FormData): Promise<AxiosResponse> => {
    return request({
        url: '/extra/resource/upload',
        method: 'POST',
        headers: {'content-type': 'multipart/form-data'},
        data: value
    }, true)
}

// 删除图片
const deleteFileApi = (resourceType: number, fileName: string): Promise<AxiosResponse> => {
    return request({
        url: '/extra/resource/delete',
        method: 'DELETE',
        params: {
            resource_type: resourceType,
            file_name: fileName
        }
    }, true)
}

export { uploadFileApi, deleteFileApi }