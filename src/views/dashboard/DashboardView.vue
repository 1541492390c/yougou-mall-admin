<script setup lang='ts'>
import { onMounted } from 'vue'
import ViewHeader from '@/components/header/ViewHeader.vue'
import Menus from '@/components/menus/Menus.vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
	getUserinfo()
	getCategoryList()
})

// 获取用户信息
const getUserinfo = (): void => {
	store.dispatch('getUserinfo')
}

// 获取分类列表
const getCategoryList = (): void => {
	store.dispatch('getCategoryList')

}
</script>

<template>
	<div class='main'>
		<el-container>
			<el-aside class='menu'>
				<menus />
			</el-aside>
			<el-container>
				<el-header>
					<view-header />
				</el-header>
				<el-main>
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<style scoped lang='scss'>
.main {
	height: 100%;
}

.menu {
	width: 200px;
}
</style>