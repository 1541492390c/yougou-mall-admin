//是否为NULL
const isNull = (value: any): boolean => {
    return value == null || typeof (value) == 'undefined'
}

//是否为空(包括空字符串、空格、null,{})
const isEmpty = (value: any): boolean => {
    if (!isNull(value)) { // 先判断是否为null，返回true ，判断是否为空字符串，返回true
        // 空对象
        if(value instanceof Object){
            if(JSON.stringify(value)== "{}"){
                return true
            }
        }
        if ((value + '').replace(/(^\s*)|(\s*$)/g, '').length === 0) {
            return true
        }
    } else {
        return true
    }
    // 不为空返回false
    return false
}

export { isEmpty }