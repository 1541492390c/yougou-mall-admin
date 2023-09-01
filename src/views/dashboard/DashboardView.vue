<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { User } from '@/interface/user'
import ViewHeader from '@/components/header/ViewHeader.vue'
import Menus from '@/components/menus/Menus.vue'
import { getUserinfoApi } from '@/api/user/user-api'

onMounted(() => {
	getUserinfo()
})

const userinfo = ref<User>()

// watch(() => store.getters.userinfo, (newValue) => {
//     userinfo.value = newValue
// 		console.log(newValue)
// })

const getUserinfo = (): void => {
	getUserinfoApi().then((res): void => {
		if (res) {
			userinfo.value = res.data
		}
	}).catch((err) => {
		console.log(err)
	})
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
					<view-header :userinfo='userinfo' />
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