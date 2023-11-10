<template>
  <div class="chat-message" :style="{ flexDirection: props.isSelf ? 'row-reverse' : 'row' }">
    <div class="avatar" @click="displayProfile">
      <el-image :src="message?.fromUser?.avatar" fit="cover" :lazy="true" alt="user avatar"></el-image>
    </div>
    <div style="display: flex; align-items: end; gap: 8px; max-width: calc(100% - 48px * 2);"
      :style="{ flexDirection: props.isSelf ? 'row-reverse' : 'row' }">
      <div class="content">
        <component :is="content" :content="message?.content" />
      </div>
      <el-icon v-if="message?.status === ChatMessageStatus.Sending">
        <Loading style="animation: loading-rotate 2s linear infinite;" />
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
import AuidoMessage from './AuidoMessage.vue';
import { showUserProfile } from '../Profile';

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
    case ChatMessageType.Audio:
      return AuidoMessage
    case ChatMessageType.OtherFile:
      return FileMessage
    default:
      return NotSupportedMessage;
  }
})

const displayProfile = (e: MouseEvent) => {
  showUserProfile(e, message.value?.fromUser!);
}

</script>

<style lang="scss" scoped>
.chat-message {
  display: flex;
  gap: 20px;
  padding: 4px 16px;
}

:deep(.avatar) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  & img {
    user-select: none;
    -webkit-user-drag: none;
  }
}

.content {
  border-radius: 12px;
  background-color: var(--message-bg-color);
  color: var(--message-title-text-color);
  overflow: hidden;
}
</style>
