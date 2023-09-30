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
    productId?: number,
    brandId?: number,
    state?: number,
    price: number,
    discount: number | undefined,
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
    node?: string,
    children?: Array<Category>
}

// 商品属性值
interface AttrValue {
    attrValueId?: number,
    attrId?: number,
    name: string
}

// 商品sku
interface Sku {
    skuId?: number,
    productId?: number,
    skuStock: number,
    price: number,
    discount?: number,
    discountPrice: number,
    description: string,
    isDiscount?: boolean,
    skuSpecs: string
}

export type { Brand, Product, Category, AttrValue, Sku }