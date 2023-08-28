<template>
  <div class="chat-message" :style="{ flexDirection: props.isSelf ? 'row-reverse' : 'row' }">
    <div class="avatar">
      <el-image :src="message?.fromUser?.avatar" fit="fill" :lazy="true"></el-image>
    </div>
    <div style="display: flex; align-items: end; gap: 8px;"
      :style="{ flexDirection: props.isSelf ? 'row-reverse' : 'row' }">
      <div class="content">
        <component :is="content" :content="message?.content" />
      </div>
      <el-icon v-if="message?.status === ChatMessageStatus.Sending">
        <Loading />
      </el-icon>
      <el-icon style="cursor: pointer;" v-else-if="message?.status === ChatMessageStatus.Failed" color="#F74C30">
        <WarningFilled />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ChatMessage, ChatMessageStatus, ChatMessageType } from '../../types/Types';
import FileMessage from './FileMessage.vue';
import ImageMessage from './ImageMessage.vue';
import TextMessage from './TextMessage.vue';
import VideoMessage from './VideoMessage.vue';
import NotSupportedMessage from './NotSupportedMessage.vue'
import { Loading, WarningFilled } from '@element-plus/icons-vue'

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
