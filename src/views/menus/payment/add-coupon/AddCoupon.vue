<script setup lang='ts'>
import { getCategoryListApi } from '@/api/product/category-api'
import { Category } from '@/interface/product'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { saveCouponApi } from '@/api/payment/coupon-api'
import { Coupon } from '@/interface/payment'

const form = ref<FormInstance>()
const categoryList = ref<Array<Category>>([])
const categoryOptions = ref<Array<number>>([])
const formData = reactive<Record<string, any>>({
	expired: 1,
	quota: 0,
	usedAmount: 0,
	discountAmount: 0,
	categoryNode: '',
	description: ''
})

onMounted(() => {
	getCategoryList()
})

const getCategoryList = (): void => {
	getCategoryListApi().then((res) => {
		categoryList.value = res.data

		// 通用分类
		let common: Category = {categoryId: 0, parentId: 0, level: 0, name: '通用'}
		categoryList.value.unshift(common)
	}).catch((err) => {
		console.log(err)
	})
}

const handleSelect = (value: Array<number>): void => {
	categoryOptions.value = value
	formData.categoryNode = value.join('-')
}

// 添加优惠券
const addCoupon = (form: FormInstance | undefined): void => {
	form?.validate((valid) => {
		if (!valid) {
			return
		}
		saveCouponApi(formData as Coupon).then((res) => {
			if (res) {
				ElMessage.success('添加成功')
				form?.resetFields()
			}
		}).catch((err) => {
			console.log(err)
		})
	})
}
</script>

<template>
	<div class='card'>
		<div class='header'>
			<span>添加品牌</span>
		</div>
		<div class='main'>
			<el-form ref='form' :model='formData' label-width='120'>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='优惠券类型' prop='categoryNode' required style='width: 100%'>
								<el-cascader :model-value='categoryOptions' :options='categoryList'
														 @change='(value: Array<number>) => handleSelect(value)'
														 :props="{value: 'categoryId', label: 'name', checkStrictly: true}" placeholder='请选择分类'
														 style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='过期天数' prop='expired' required style='width: 100%'>
								<el-input-number v-model='formData.expired' :min='1' :max='10' placeholder='请输入过期天数'
																 style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='使用金额' prop='usedAmount' required style='width: 100%'>
								<el-input-number v-model='formData.usedAmount' :min='0' placeholder='请输入使用金额'
																 style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='抵扣金额' prop='discountAmount' required style='width: 100%'>
								<el-input-number v-model='formData.discountAmount' :min='0' placeholder='请输入抵扣金额'
																 style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='配额' prop='quota' required style='width: 100%'>
								<el-input-number v-model='formData.quota' :min='0' placeholder='请输入配额' style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span='10'>
						<div class='form-row'>
							<el-form-item label='简介' prop='description' required style='width: 100%'>
								<el-input v-model='formData.description' type='textarea' placeholder='请输入简介' style='width: 100%' />
							</el-form-item>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<div class='add-button'>
						<el-button @click='addCoupon(form)' type='primary'>确认添加</el-button>
					</div>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<style scoped lang='scss'>
.add-button {
	margin-top: 20px;
	margin-bottom: 20px;
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>