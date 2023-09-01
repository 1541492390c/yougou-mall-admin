<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'

const router = useRouter()
const menuItems = ref<Array<RouteRecordRaw>>([])
const currentIndex = ref<string>('')

onMounted(() => {
	transformRoutes()
	getCurrentIndex()
})

watch(router.currentRoute, () => {
	getCurrentIndex()
})

// 解析路由
const transformRoutes = (): void => {
	menuItems.value = router.options.routes[1].children as Array<RouteRecordRaw>
}

// 获取当前索引
const getCurrentIndex = (): void => {
	currentIndex.value = router.currentRoute.value.fullPath
}
</script>

<template>
	<div class='main'>
		<el-menu router :default-active='currentIndex'>
			<template v-for='(item, index) in menuItems' :key='index'>
				<!--展开菜单-->
				<el-sub-menu v-if='item.children && item.children.length !== 0' :index='item.path'>
					<template #title>
						<span>{{item.meta.title}}</span>
					</template>
					<!--加载子路由-->
					<el-menu-item v-for='(child, j) in item.children'
												:key='j' :index="'/dashboard/' + item.path + '/' + child.path">
						<span>{{child.meta.title}}</span>
					</el-menu-item>
				</el-sub-menu>
				<!--非展开菜单-->
				<el-menu-item v-else :index="'/dashboard/' + item.path">
					<span>{{item.meta.title}}</span>
				</el-menu-item>
			</template>
		</el-menu>
	</div>
</template>

<style scoped lang='scss'>
.main {
	background-color: #222222;
}

.el-menu {
	width: 100%;
	border-right: none;
	background-color: #222222;
}

.el-menu-item {
	background-color: #222222;
	color: white;

	&:hover {
		background-color: #f13a3a;
		color: white;
	}
}

.el-menu-item.is-active {
	background-color: #f13a3a;
	color: white;
}

:deep(.el-sub-menu__title) {
	color: white;
	background-color: #222222;

	&:hover {
		color: white;
		background-color: #f13a3a;
	}
}
</style>