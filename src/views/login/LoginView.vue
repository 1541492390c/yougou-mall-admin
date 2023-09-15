<script setup lang='ts'>
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { loginApi } from '@/api/auth/auth-api'
import { useRouter } from 'vue-router'
import { Lock, User } from '@element-plus/icons-vue'
import { baseUrl } from '@/request'

const captchaUrl: string = baseUrl + '/extra/captcha/image'
const components = defineComponent({ user: User, lock: Lock })
const router = useRouter()
const random = ref(Math.random())
const formRef = ref<FormInstance>()
const buttonDisabled = ref<boolean>(false)
const formData = reactive({
	username: '',
	password: '',
	code: ''
})

onMounted(() => {
	document.body.style.backgroundColor = '#222222'
	if (!!localStorage.getItem('token')) {
		router.replace({path: '/dashboard/index'})
	}
})

onUnmounted(() => {
	document.body.style.backgroundColor = ''
})

const resetRandom = (): void => {
	random.value = Math.random()
}

const validateUsername = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入账号'))
	}
	callback()
}

const validatePassword = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入密码'))
	}
	if (value.length < 6) {
		callback(new Error('密码不能少于6个字符'))
	}
	callback()
}

const validateCode = (rule: any, value: any, callback: any): void => {
	if (!value) {
		callback(new Error('请输入验证码'))
	}
	if (value.length !== 4) {
		callback(new Error('请输入正确的验证码'))
	}
	callback()
}

const submitForm = (form: FormInstance | undefined): void => {
	if (!form) {
		return
	}
	form.validate((valid) => {
		if (valid) {
			buttonDisabled.value = true
			loginApi(formData.username, formData.password, formData.code).then((res) => {
				if (res) {
					localStorage.setItem('token', res.data.accessToken)
					ElMessage.success('登录成功')
					router.replace('/dashboard/index')
				}
			}).catch((err) => {
				console.log(err)
			})
		} else {
			return false
		}
	}).finally(() => {
		buttonDisabled.value = false
	})
}

const formRules = reactive<FormRules>({
	username: [{validator: validateUsername, trigger: 'blur'}],
	password: [{validator: validatePassword, trigger: 'blur'}],
	code: [{validator: validateCode, trigger: 'blur'}]
})
</script>

<template>
	<div class='main'>
		<div class='title'>
			<span>优购商城后台管理系统</span>
		</div>
		<div class='form'>
			<el-form :model='formData' :rules='formRules' ref='formRef'>
				<el-form-item prop='username'>
					<el-input v-model='formData.username' :prefix-icon='components.user' placeholder='请输入用户名' />
				</el-form-item>
				<el-form-item prop='password'>
					<el-input v-model='formData.password' :prefix-icon='components.lock' show-password placeholder='请输入密码' />
				</el-form-item>
				<el-form-item prop='code'>
					<el-input v-model='formData.code' :prefix-icon='components.lock' placeholder='请输入验证码'>
						<template #suffix>
							<img :src="captchaUrl + '?random=' + random" @click='resetRandom' alt='' class='captcha' />
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button :disabled='buttonDisabled' @click='submitForm(formRef)' type='primary' class='login-button'>
						<span>登录</span>
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<style scoped lang='scss'>
.title {
	color: white;
	font-size: 40px;
}

.main {
	top: 30%;
	left: 50%;
	position: absolute;
	transform: translate(-50%, -50%);
}

.form {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}

.el-input {
	width: 380px;
}

.login-button {
	width: 100%;
}

.captcha {
	border: #ececec solid 1px;
	cursor: pointer;
	width: 100%;
	height: 30px;
}
</style>