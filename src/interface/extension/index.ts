import { Brand, Product } from '@/interface/product'
import { Coupon } from '@/interface/payment'

// 商品展示数据
interface ProductTable extends Product {
    options: Array<number>
}

// 品牌展示数据
interface BrandTable extends Brand {
    options: Array<number>
}

// 优惠券展示数据
interface CouponTable extends Coupon {
    options: Array<number>
}

export type { ProductTable, BrandTable, CouponTable }