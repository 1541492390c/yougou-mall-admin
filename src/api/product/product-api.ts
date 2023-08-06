import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取商品分页信息接口
const getProductPagesApi = (pageNum: number = 1, pageSize: number = 10, isDiscount: boolean | undefined, recommended: boolean | undefined, categoryNode: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            is_discount: isDiscount,
            recommended: recommended,
            category_node: categoryNode
        }
    })
}

export { getProductPagesApi }