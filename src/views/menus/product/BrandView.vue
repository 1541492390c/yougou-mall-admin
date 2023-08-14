<template>
	<div class='card'>
		<el-table>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
		</el-table>
	</div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { Brand } from '@/interface/product'
import { getBrandPagesApi } from '@/api/product/brand-api'

const brandList = ref<Array<Brand>>()
const data = reactive({
    total: 0,
    currentPage: 1
})

// onMounted(() => {
//     getBrandList(data.currentPage)
// })

const getBrandList = (pageNum: number) => {
    getBrandPagesApi(pageNum).then((res) => {
        if (res) {
            data.total = res.data.data.total
            brandList.value = res.data.data.list
        }
    }).catch((err) => {
        console.log(err)
    })
}
</script>

<style scoped lang='scss'>
</style>