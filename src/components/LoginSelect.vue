<template>
  <div class="login-select" ref="loginInput" tabindex="-1" @click="focusHandle">
    <span></span>
    <div class="input-box">
      <input :type="type" ref="input" v-model="value" :placeholder="placeholder">
    </div>
    <div class="icons">
      <el-icon v-if="showClear" @click="clearHandle">
        <CloseBold />
      </el-icon>
      <el-icon v-if="showOptions">
        <ArrowUpBold />
      </el-icon>
      <el-icon v-else @click.stop="showOptions = true">
        <ArrowDownBold />
      </el-icon>
    </div>

    <Teleport to="body">
      <div class="select-option-box" v-if="showOptions" ref="optionsBox">
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang='ts'>
import { CloseBold, ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import { onClickOutside, useElementBounding, useElementSize, useFocusWithin } from '@vueuse/core';

const props = withDefaults(defineProps<{
  placeholder?: string,
  type?: "text" | "password",
  clearable?: boolean
}>(), {
  type: "text",
  clearable: false
})

const showOptions = ref<boolean>(false)

const optionsBox = ref<HTMLInputElement | null>(null)

onClickOutside(optionsBox, () => showOptions.value = false)

const input = ref<HTMLInputElement | null>(null)
const loginInput = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(loginInput)
const { width } = useElementSize(loginInput)

const { height, top, left } = useElementBounding(loginInput)
const popupTop = computed(() => (height.value + top.value) + "px");
const popupWidth = computed(() => width.value + "px");
const popupLeft = computed(() => left.value + "px");

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
.login-select {
  position: relative;
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
  color: black;
}

.input-box>input:focus::placeholder {
  opacity: 0;
}

input[type="password"]::-ms-reveal {
  display: none
}

.icons {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: end;
  padding-right: 1rem;
}

.icons>.el-icon {
  cursor: pointer;
}
</style>

<style>
.select-option-box {
  position: absolute;
  width: v-bind(popupWidth);
  left: v-bind(popupLeft);
  top: v-bind(popupTop);
  z-index: 9999;
  padding: 20px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 0 4px gray;
}
</style>
