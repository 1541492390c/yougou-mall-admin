<template>
	<div class='main'>
		<el-menu router :default-active='data.index'>
			<!--首页-->
			<el-menu-item index='index'>
				<template #title>
					<el-icon>
						<house />
					</el-icon>
					<span>首页</span>
				</template>
			</el-menu-item>

			<!--用户员管理-->
			<el-menu-item index='user'>
				<template #title>
					<el-icon>
						<user />
					</el-icon>
					<span>用户管理</span>
				</template>
			</el-menu-item>

			<!--订单管理-->
			<el-menu-item index='order'>
				<template #title>
					<el-icon>
						<van />
					</el-icon>
					<span>订单管理</span>
				</template>
			</el-menu-item>

			<!--商品管理-->
			<el-sub-menu index='1'>
				<template #title>
					<el-icon>
						<box />
					</el-icon>
					<span>商品管理</span>
				</template>
				<!--商品管理--分类管理-->
				<el-menu-item index='category'>
					<span>分类管理</span>
				</el-menu-item>
				<!--商品管理--品牌管理-->
				<el-menu-item index='brand'>
					<span>品牌管理</span>
				</el-menu-item>
				<!--商品管理--商品管理-->
				<el-menu-item index='product'>
					<span>商品管理</span>
				</el-menu-item>
				<!--商品管理--添加商品-->
				<el-menu-item index='add_product'>
					<span>添加商品</span>
				</el-menu-item>
				<!--商品管理--添加品牌-->
				<el-menu-item index='add_brand'>
					<span>添加品牌</span>
				</el-menu-item>
			</el-sub-menu>

			<!--平台管理-->
			<el-sub-menu index='2'>
				<template #title>
					<el-icon>
						<monitor />
					</el-icon>
					<span>平台管理</span>
				</template>
				<!--平台管理--轮播图管理-->
				<el-menu-item index='banner'>
					<span>轮播图管理</span>
				</el-menu-item>
				<el-menu-item index='feedback_type'>
					<!--平台管理--反馈类型管理-->
					<span>反馈类型管理</span>
				</el-menu-item>
			</el-sub-menu>

			<!--财务管理-->
			<el-sub-menu index='3'>
				<template #title>
					<el-icon>
						<coin />
					</el-icon>
					<span>财务管理</span>
				</template>
			</el-sub-menu>

			<!--用户反馈-->
			<el-menu-item index='feedback'>
				<el-icon>
					<message />
				</el-icon>
				<span>用户反馈</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script setup lang='ts'>
import { House, User, Box, Monitor, Van, Message, Coin } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

onMounted(() => {
    getCurrentIndex()
})

const route = useRoute()
const data = reactive({
    index: ''
})

const getCurrentIndex = (): void => {
    data.index = route.path.substring(route.path.lastIndexOf('/') + 1)
}
</script>

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