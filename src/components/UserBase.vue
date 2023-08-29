<template>
  <div class="user-base">
    <el-image :src="user.avatar" fit="cover" :lazy="true"
      style="width: 40px; height: 40px; border-radius: 50%;"></el-image>
    <div class="base-info">
      <span class="name" v-html="highlight(user.nickName!)"></span>
      <span class="account" v-html="highlight(user.account)"></span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { UserInfo } from '../types/Types';

const props = withDefaults(defineProps<{
  user: UserInfo,
  highlightText?: string,
  useHighlight?: boolean
}>(), {
  useHighlight: false
})

const highlight = (text: string): string => {
  if (!props.useHighlight || !props.highlightText) return text;
  const searchChars = props.highlightText.toLocaleLowerCase().split('')
  return text.split('').map(char => {
    if (searchChars.includes(char.toLocaleLowerCase())) {
      return `<i style="color:var(--primary)">${char}</i>`
    } else {
      return char;
    }
  }).join('')
}

</script>

<style scoped>
.user-base {
  height: 50px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
}

.base-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.base-info>.name {
  font-size: 16px;
}

.base-info>.account {
  color: #999;
}
</style>
