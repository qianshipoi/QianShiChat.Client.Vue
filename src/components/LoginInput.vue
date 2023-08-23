<template>
  <div class="login-input" ref="loginInput" tabindex="-1" @click="focusHandle">
    <span></span>
    <div class="input-box">
      <input :type="type" ref="input" :value="value" :placeholder="placeholder">
    </div>
    <div class="icons">
      <el-icon v-if="showClear" @click="clearHandle">
        <CloseBold />
      </el-icon>
      <slot name="icons" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { CloseBold, } from '@element-plus/icons-vue'
import { useFocusWithin } from '@vueuse/core';

const props = withDefaults(defineProps<{
  placeholder?: string,
  type?: "text" | "password",
  clearable?: boolean
}>(), {
  type: "text",
  clearable: false
})


const input = ref<HTMLInputElement | null>(null)
const loginInput = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(loginInput)

const showClear = computed(() => props.clearable && focused.value && value.value)
const value = defineModel<string>();

const clearHandle = () => {
  value.value = ''
  input.value?.focus();
}

const focusHandle = () => {
  input.value?.focus();
}

</script>

<style scoped>
.login-input {
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: 46px auto 46px;
  background-color: rgba(255, 255, 255, .6);
  border-radius: 4px;
  min-height: 44px;
  transition: background-color .3s ease;
}

.login-input:focus-within {
  background-color: white;
}

.input-box {
  overflow: hidden;
}

.input-box>input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  background-color: transparent;
}

.input-box>input:focus::placeholder {
  opacity: 0;
}

input[type="password"]::-ms-reveal {
  display: none
}

.icons {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: end;
  padding-right: 1rem;
}

.icons>.el-icon {
  cursor: pointer;
}
</style>
