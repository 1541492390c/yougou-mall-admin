<template>
	<div>
		<el-dialog v-model='showDialog' :center='true' @close='closeDialog' style='width: 600px' title='修改密码'>
			<el-form :model='formData' :rules='formRules' ref='formRef'>
				<el-form-item prop='password'>
					<el-input v-model='formData.password' show-password placeholder='请输入原密码' />
				</el-form-item>
				<el-form-item prop='newPassword'>
					<el-input v-model='formData.newPassword' show-password placeholder='请输入新密码' />
				</el-form-item>
				<el-form-item prop='newPassword2'>
					<el-input v-model='formData.newPassword2' show-password placeholder='请再次输入新密码' />
				</el-form-item>
				<el-form-item>
					<div class='form-bottom'>
						<el-button @click='updatePassword(formRef)' type='primary' class='update-password-button'>确认修改</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup lang='ts'>

import { computed, reactive, ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { updatePasswordApi } from '@/api/auth/auth-api'

const props = defineProps<{ show: boolean }>()
const emits = defineEmits<{ (e: 'closeDialog'): void }>()
const formRef = ref<FormInstance>()
const formData = reactive({
    password: '',
    newPassword: '',
    newPassword2: ''
})

const showDialog = computed(() => {
    return props.show
})

const closeDialog = (): void => {
    formRef.value?.resetFields()
    emits('closeDialog')
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

const validateNewPassword = (rule: any, value: any, callback: any): void => {
    if (!value) {
        callback(new Error('请输入新密码'))
    }
    if (value.length < 6) {
        callback(new Error('新密码不能少于6个字符'))
    }
    callback()
}

const validateNewPassword2 = (rule: any, value: any, callback: any): void => {
    if (!value) {
        callback(new Error('请再次输入新密码'))
    }
    if (value !== formData.newPassword) {
        callback(new Error('两次密码不一致'))
    }
    if (value.length < 6) {
        callback(new Error('新密码不能少于6个字符'))
    }
    callback()
}

const updatePassword = (form: FormInstance | undefined): void => {
    if (!form) {
        return
    }
    form.validate((valid) => {
        if (valid) {
            updatePasswordApi({password: formData.password, newPassword: formData.newPassword})
                .then((res) => {
                    if (res) {
                        ElMessage.success('修改密码成功')
                        closeDialog()
                    }
                }).catch((err) => {
                console.log(err)
            })
        }
    })
}

const formRules = reactive<FormRules>({
    password: [{validator: validatePassword, trigger: 'blur'}],
    newPassword: [{validator: validateNewPassword, trigger: 'blur'}],
    newPassword2: [{validator: validateNewPassword2, trigger: 'blur'}]
})
</script>

<style scoped lang='scss'>
.form-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
}

.update-password-button {
  height: 42px;
}
</style>