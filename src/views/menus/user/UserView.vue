<template>
	<div class='card'>
		<el-table :data='userList'>
			<template #empty>
				<el-empty description='暂无数据' />
			</template>
			<el-table-column label='头像' align='center'>
			</el-table-column>
			<el-table-column prop='username' label='用户名' align='center' />
			<el-table-column label='性别' align='center'>
			</el-table-column>
			<el-table-column prop='birthday' label='生日' align='center' />
			<el-table-column label='状态' align='center'>
			</el-table-column>
			<el-table-column label='操作' align='center'>
			</el-table-column>
		</el-table>
		<div class='pagination'>
			<el-pagination :total='data.total'
										 :page-size='data.pageSize'
										 :current-page='data.currentPage'
										 @current-change='currentPageChange'
										 layout='prev, pager, next' background />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import { getUserPagesApi } from '@/api/user'
import { User } from '@/interface/user'

const userList = ref<Array<User>>()
const data = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 10
})

onMounted(() => {
    getUserList(data.currentPage)
})

const getUserList = (pageNum: number): void => {
    getUserPagesApi(pageNum, data.pageSize).then((res) => {
        if (res) {
            userList.value = res.data.list
            data.total = res.data.total
        }
    }).catch((err) => {
        console.log(err)
    })
}

const currentPageChange = (value: number): void => {
    data.currentPage = value
    getUserList(value)
}
</script>

<style scoped lang='scss'>
</style>