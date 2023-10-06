<script setup lang='ts'>
import { computed, reactive, ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { saveAdminApi } from '@/api/user/user-api'

const props = defineProps<{ show: boolean }>()
const emits = defineEmits<{ (e: 'closeDialog', isAdd: boolean): void }>()
const form = ref<FormInstance>()
const formData = reactive<Record<string, any>>({
	userType: 1,
	nickname: '',
	username: '',
	password: '',
	password2: '',
	role: 'COMMON_ADMIN'
})

const showDialog = computed(() => {
	return props.show
})

const closeDialog = (isAdd: boolean): void => {
	emits('closeDialog', isAdd)
}

const validateUsername = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入用户名'))
	}
	callback()
}

const validateNickname = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入昵称'))
	}
	callback()
}

const validatePassword = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入原密码'))
	}
	if (value.length < 6) {
		callback(new Error('密码不能少于6个字符'))
	}
	callback()
}

const validatePassword2 = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请再次确认密码'))
	}
	if (value.length < 6) {
		callback(new Error('密码长度不小于6个字符'))
	}
	if (value !== formData.password) {
		callback(new Error('两次密码不一致'))
	}
	callback()
}

const addAdmin = (form: FormInstance | undefined): void => {
	form?.validate((valid) => {
		if (!valid) {
			return
		}
		let value: any = {
			username: formData.username,
			nickname: formData.nickname,
			password: formData.password,
			role: formData.role
		}
		saveAdminApi(value).then((res) => {
			if (res) {
				ElMessage.success('添加成功')
				closeDialog(true)
			}
		}).catch((err) => {
			console.log(err)
		})
	})
}

const formRules = reactive<FormRules>({
	username: [{validator: validateUsername, trigger: 'blur'}],
	nickname: [{validator: validateNickname, trigger: 'blur'}],
	password: [{validator: validatePassword, trigger: 'blur'}],
	password2: [{validator: validatePassword2, trigger: 'blur'}]
})
</script>

<template>
	<el-dialog v-model='showDialog' title='添加管理员' center @close='closeDialog(false)'>
		<el-form :model='formData' :rules='formRules' ref='form' label-width='120'>
			<el-form-item label='用户名' prop='username'>
				<el-input v-model='formData.username' placeholder='请输入用户名' />
			</el-form-item>
			<el-form-item label='昵称' prop='nickname'>
				<el-input v-model='formData.nickname' placeholder='请输入昵称' />
			</el-form-item>
			<el-form-item label='密码' prop='password'>
				<el-input v-model='formData.password' show-password placeholder='请输入密码' />
			</el-form-item>
			<el-form-item label='确认密码' prop='password2'>
				<el-input v-model='formData.password2' show-password placeholder='请再次确认密码' />
			</el-form-item>
			<el-form-item label='管理员权限' prop='role'>
				<el-radio-group v-model='formData.role'>
					<el-radio label='COMMON_ADMIN'>普通管理员</el-radio>
					<el-radio label='SUPER_ADMIN'>超级管理员</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<div class='form-bottom'>
					<el-button @click='addAdmin(form)' type='primary'>确认添加</el-button>
				</div>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<style scoped lang='scss'>
.form-bottom {
	width: 85%;
	display: flex;
	justify-content: center;
}
</style>