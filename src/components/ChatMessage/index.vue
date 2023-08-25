<template>
  <div class="chat-message" :style="{ flexDirection: props.isSelf ? 'row-reverse' : 'row' }">
    <div class="avatar">
      <el-image :src="message?.fromUser?.avatar" fit="fill" :lazy="true"></el-image>
    </div>
    <div class="content">
      <component :is="content" :content="message?.content" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ChatMessage, ChatMessageType } from '../../types/Types';
import FileMessage from './FileMessage.vue';
import ImageMessage from './ImageMessage.vue';
import TextMessage from './TextMessage.vue';
import VideoMessage from './VideoMessage.vue';
import NotSupportedMessage from './NotSupportedMessage.vue'
const message = defineModel<ChatMessage>()

const props = withDefaults(defineProps<{
  isSelf?: boolean
}>(), {
  isSelf: false
})

const content = computed(() => {
  switch (message.value?.messageType) {
    case ChatMessageType.Text:
      return TextMessage
    case ChatMessageType.Image:
      return ImageMessage
    case ChatMessageType.Video:
      return VideoMessage
    case ChatMessageType.OtherFile:
      return FileMessage
    default:
      return NotSupportedMessage;
  }
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
  background-color: white;
  overflow: hidden;
}
</style>
