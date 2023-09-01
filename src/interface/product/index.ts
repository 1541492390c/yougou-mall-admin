// 品牌
interface Brand {
    brandId: string,
    name: string,
    categoryNode: string,
    img: string,
    description: string
}

// 商品
interface Product {
    productId?: string,
    brandId?: number,
    state?: number,
    price: number,
    discountPrice: number,
    categoryNode: string,
    name: string,
    cover: string,
    imgList?: string,
    isDiscount: boolean,
    recommended: boolean
}

// 商品分类
interface Category {
    categoryId: number,
    parentId: number,
    level: number,
    name: string,
    node: string,
    children?: Array<Category>
}

// 商品属性值
interface AttrValue {
    attrValueId?: number,
    attrId?: number,
    name: string
}

// 商品属性
interface Attr {
    attrId?: number,
    productId?: string,
    name: string,
    attrValueList?: Array<AttrValue>
}

// 商品sku规格
interface SkuSpecs {
    attrName: string,
    attrValueName: string
}

// 商品sku
interface Sku {
    skuId: number,
    productId: string,
    skuStock: number,
    price: number,
    discount: number,
    discountPrice: number,
    description: string,
    isDiscount: boolean,
    skuSpecs: Array<SkuSpecs>
}

// 秒杀活动场次
interface SecKill {
    secKillId: number,
    description: string,
    startTime: string,
    endTime: string
}

export type { Brand, Product, Category, Attr, AttrValue, Sku, SkuSpecs, SecKill }