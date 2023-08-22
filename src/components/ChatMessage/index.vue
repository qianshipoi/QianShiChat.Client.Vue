<template>
  <div class="chat-message" :style="{ flexDirection: props.isSelf ? 'row-reverse' : 'row' }">
    <div class="avatar">
      <el-image :src="message?.fromUser?.avatar" fit="fill" :lazy="true"></el-image>
    </div>
    <div class="content">
      <TextMessage :content="message?.content" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ChatMessage } from '../../types/Types';
import TextMessage from './TextMessage.vue';
const message = defineModel<ChatMessage>()

const props = withDefaults(defineProps<{
  isSelf?: boolean
}>(), {
  isSelf: false
})

</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 20px;
  padding: 4px 16px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.content {
  border-radius: 12px;
  overflow: hidden;
}
</style>
