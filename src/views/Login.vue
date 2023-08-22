<template>
  <el-form :model="baseInfo" ref="formInstance" :rules="rules" label-width="80px" :inline="false">
    <el-form-item label="账号">
      <el-input v-model="baseInfo.account" clearable></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="baseInfo.password" show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="userStore.loading">登录</el-button>
      <el-button>注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useUserStore } from '../store/useUserStore';
import { useRoute, useRouter } from "vue-router";

interface BaseInfo {
  account: string
  password: string
}

const route = useRoute()
const router = useRouter()

const baseInfo = reactive<BaseInfo>({
  account: 'admin1',
  password: '123456'
})

const rules: FormRules<BaseInfo> = {
  account: [
    { required: true, message: 'Please input account', trigger: 'blur' },
    { min: 3, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 3, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' },
  ]
}

const formInstance = ref<FormInstance>()
const userStore = useUserStore();

const onSubmit = async () => {
  if (!formInstance.value) return;
  await formInstance.value?.validate(async (valid, fields) => {

    if (valid) {
      const result = await userStore.login(baseInfo.account, baseInfo.password)
      if (result) {
        ElMessage.success('login succeeded.')
        // redirect
        const redirectUrl = route.query['redirect'] as string
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push({ name: 'Home' })
        }
      }
    } else {
      console.log('error submit', fields);
    }
  })
}

</script>

<style>
</style>
../store/useCurrentUserStore
