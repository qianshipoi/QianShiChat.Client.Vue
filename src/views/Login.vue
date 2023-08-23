<template>
  <div class="login">
    <Draggable :initial-value="initialValue" @end="moveEnd" ref="draggable" :handle="handle" class="login-main">
      <div ref="handle" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; cursor: move;"></div>
      <div style="position: absolute; left: 28px; top: 40px; right: 28px; bottom: 28px; z-index: 2; ">
        <el-form :model="baseInfo" ref="formInstance" :rules="rules" :inline="false">
          <el-form-item prop="account">
            <!-- <login-input v-model="baseInfo.account" placeholder="请输入账号" clearable></login-input> -->
            <login-select v-model="baseInfo.account" placeholder="请输入账号" clearable>
              asdasda
            </login-select>
          </el-form-item>
          <el-form-item prop="password">
            <login-input v-model="baseInfo.password" type="password" placeholder="请输入密码" clearable></login-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%; height: 40px;" @click="onSubmit"
              :loading="userStore.loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Draggable>
  </div>
</template>

<script setup lang='ts'>
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useCurrentUserStore } from '../store/useCurrentUserStore';
import { Position, useEventListener, useSessionStorage, useThrottleFn, useWindowSize } from '@vueuse/core';
import LoginInput from '../components/LoginInput.vue';
import { UseDraggable as Draggable } from "@vueuse/components"

interface BaseInfo {
  account: string
  password: string
}

const route = useRoute()
const router = useRouter()
const { width, height } = useWindowSize()
const loginTop = useSessionStorage("login-top", -1)
const loginLeft = useSessionStorage("login-left", -1)

const moveEnd = (position: Position) => {
  loginTop.value = position.y
  loginLeft.value = position.x
}

const initialValue = reactive({
  x: loginLeft.value,
  y: loginTop.value
})

const handle = ref<HTMLElement | null>(null)

watch(() => handle.value, () => {
  const boxWidth = handle.value!.clientWidth;
  const boxHeight = handle.value!.clientHeight;

  if (initialValue.x < 0 || initialValue.y < 0 || initialValue.x > width.value - boxWidth || initialValue.y > height.value - boxHeight) {
    initialValue.x = (width.value / 2) - handle.value!.clientWidth / 2
    initialValue.y = (height.value / 2) - handle.value!.clientHeight / 2
    loginTop.value = initialValue.y
    loginLeft.value = initialValue.x
  }
})

const windowResize = useThrottleFn(() => {
  const boxWidth = handle.value!.clientWidth;
  const boxHeight = handle.value!.clientHeight;
  if (initialValue.x < 0 || initialValue.y < 0 || initialValue.x > width.value - boxWidth || initialValue.y > height.value - boxHeight) {
    initialValue.x = (width.value / 2) - handle.value!.clientWidth / 2
    initialValue.y = (height.value / 2) - handle.value!.clientHeight / 2
    loginTop.value = initialValue.y
    loginLeft.value = initialValue.x
  }
}, 1000)

useEventListener(window, "resize", windowResize)

const baseInfo = reactive<BaseInfo>({
  account: 'admin',
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
const userStore = useCurrentUserStore();

const onSubmit = async () => {
  if (!formInstance.value) return;
  await formInstance.value?.validate(async (valid, fields) => {
    if (!valid) {
      console.log('error submit', fields);
      return;
    }

    const result = await userStore.login(baseInfo.account, baseInfo.password)
    if (!result) {
      return;
    }

    ElMessage.success('login succeeded.')
    // redirect
    const redirectUrl = route.query['redirect'] as string
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push({ name: 'Home' })
    }
  })
}

</script>

<style scoped>
.login {
  position: relative;
  height: 100%;
}

.login-main {
  position: fixed;
  width: 320px;
  height: 448px;
  background-color: #D2EBFC;
  box-shadow: 0 0 10px gray;
  padding: 2em;
}

:deep(.el-select) {
  width: 100%;
  height: 44px;
  background-color: rgba(255, 255, 255, .6);
}

:deep(.select-trigger),
:deep(.select-trigger > .el-input) {
  height: 100%;
}

:deep(.select-trigger > .el-input),
:deep(.select-trigger .el-input__wrapper) {
  outline: none;
  border: none;
  box-shadow: none;
}

:deep(.select-trigger .el-input__wrapper:hover) {
  border: none;
}
</style>
