<template>
  <div class="room">
    <header>
      <span>{{ session.name }}</span>
      <div class="menu">
        <el-icon>
          <MoreFilled />
        </el-icon>
      </div>
    </header>
    <div style="flex: 1;">
      <SplitterPanel storage-key="room-chat-message" @end="moveEnd">
        <template #start>
          <el-scrollbar @scroll="messageListScrollHandle" ref="messageListBox">
            <div ref="messageBox">
              <div v-for="message in messages" :key="message.id" style="margin-bottom: 8px;">
                <ChatMessage :model-value="message" :is-self="isSelf(message.fromId)" />
              </div>
            </div>
          </el-scrollbar>
        </template>
        <template #end>
          <div class="send-box">
            <div class="options">
              <el-icon @click="open">
                <FolderAdd />
              </el-icon>
            </div>
            <!-- <el-scrollbar class="message-editor-scrollbar">
              <div class="message-editor" contenteditable>
                asdsad
                <img src="http://localhost:5224/Raw/DefaultAvatar/1.jpg">
              </div>
            </el-scrollbar> -->
            <el-input style="height: 100%;" resize="none" type="textarea" v-model="messageContent"></el-input>
            <el-button style="position: absolute; bottom: 20px; right: 20px;" type="primary" size="default" @click="send"
              :disabled="!messageContent">发送</el-button>
          </div>
        </template>
      </SplitterPanel>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { MoreFilled, FolderAdd } from '@element-plus/icons-vue';
import { useElementSize, useFileDialog } from '@vueuse/core';
import { useChatMessage } from './useChatMessage';
import ChatMessage from '../../components/ChatMessage/index.vue';
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { Session } from '../../types/Types';
import { ElNotification, ElScrollbar } from 'element-plus';
import SplitterPanel from '../../components/SplitterPanel.vue';
const FILE_MAX_SIZE = 1024 * 1024 * 30;

const props = defineProps<{
  session: Session
}>()
const currentUserStore = useCurrentUserStore();
const { getRoomMessage } = useChatMessage()

const messageContent = ref<string>("")
const messageListBox = ref<InstanceType<typeof ElScrollbar> | null>(null)
const messageBox = ref<HTMLDivElement | null>(null)
const { height: messageBoxHeight } = useElementSize(messageBox)

const { loadData, messages, sendText, sendFile, clearUnread } = getRoomMessage(props.session.id)

const messageBoxScrollDown = () => {
  messageListBox.value?.scrollTo({
    top: messageBoxHeight.value,
    behavior: "smooth",
  })
}

const moveEnd = () => {
  messageListBox.value?.update()
}

onMounted(async () => {
  await loadData()
  await nextTick(() => {
    messageBoxScrollDown();
  })
})

const isSelf = (formId: number): boolean => {
  return formId === currentUserStore.userInfo?.id
}

const send = async () => {
  await sendText(messageContent.value)
  messageContent.value = ''
  messageBoxScrollDown();
}

const { open, onChange } = useFileDialog({

})

onChange(async (files) => {
  if (!files || files.length === 0) return;
  const file = files[0];
  if (file.size > FILE_MAX_SIZE) {
    ElNotification.warning(`The uploaded file size cannot be larger than ${FILE_MAX_SIZE / 1024 / 1024}`)
    return;
  }
  await sendFile(files[0])
  messageBoxScrollDown();
})

const messageListScrollHandle = (e: { scrollLeft: number, scrollTop: number }) => {
  if (props.session.unreadCount > 0 && e.scrollTop + (messageListBox.value?.wrapRef?.clientHeight ?? 0) + 40 > messageBoxHeight.value) {
    clearUnread()
  }
}

</script>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 18px;
  height: 68px;
  border-bottom: 1px solid #E9E9E9;
}

.el-icon {
  cursor: pointer;
  font-size: 26px;
  padding: 4px;
}

.el-icon:hover {
  color: var(--primary);
}

.message-editor-scrollbar {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.message-editor {
  padding: 1rem;
}

.message-editor:focus {
  outline: none;
}

.message-editor>img {
  max-width: 100px;
  max-height: 60px;
}

:deep(.el-textarea__inner) {
  height: 100%;
}

:deep(.el-textarea__inner),
:deep(.el-textarea__inner:focus) {
  box-shadow: none;
  background-color: transparent;
}

.send-box {
  position: relative;
  height: 100%;
  text-align: left;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: .4rem 1rem;
}

.send-box :deep(.el-textarea__inner) {
  padding: 0;
}
</style>
