<template>
  <div class="room">
    <header>
      <div class="left">
        <span>{{ room.name }}</span>
        <span v-if="!isGroup">[{{ (room.toObject as UserInfo).isOnline ? t('status.online') : t('status.offline')
        }}]</span>
      </div>
      <div class="menu">
        <el-icon>
          <MoreFilled />
        </el-icon>
      </div>
    </header>
    <div style="flex: 1;">
      <DropFilePanel @drop="fileDropHandle" :close-rect="closeRect">
        <SplitterPanel storage-key="room-chat-message" @end="moveEnd">
          <template #start>
            <el-scrollbar @scroll="messageListScrollHandle" ref="messageListBox">
              <div ref="messageBox">
                <div v-for="message in messages" :key="message.id" style="margin-bottom: 8px;">
                  <ChatMessage :model-value="message" :is-self="isSelf(message.fromId)" />
                </div>
              </div>
            </el-scrollbar>

            <button v-if="!isActive" class="goto-bottom" @click="messageBoxScrollDown()">
              <el-icon>
                <ArrowDownBold />
              </el-icon>
            </button>

            <UploadFileList ref="uploadFileList" @completed="sendAttachment" :files="waitUploadFiles"
              style="position: absolute; left: 1rem; right: 1rem; bottom: 1rem;" />
          </template>
          <template #end>
            <div class="send-box">
              <div class="options">
                <el-icon @click="open">
                  <FolderAdd />
                </el-icon>
              </div>
              <!-- <el-scrollbar class="message-editor-scrollbar">
                <div class="message-editor" ref="messageEditor" contenteditable>
                  asdsad
                  <img src="http://localhost:5224/Raw/DefaultAvatar/1.jpg">
                </div>
              </el-scrollbar> -->
              <el-input style="height: 100%;" resize="none" type="textarea" v-model="messageContent"></el-input>
              <el-button style="position: absolute; bottom: 20px; right: 20px;" type="primary" size="default"
                @click="send" :disabled="!messageContent">发送</el-button>
            </div>
          </template>
        </SplitterPanel>
      </DropFilePanel>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { MoreFilled, FolderAdd, ArrowDownBold } from '@element-plus/icons-vue';
import { useElementBounding, useElementSize, useFileDialog, useThrottleFn, watchPausable, watchThrottled } from '@vueuse/core';
import { useChatMessage } from './useChatMessage';
import ChatMessage from '../../components/ChatMessage/index.vue';
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { ElNotification, ElScrollbar } from 'element-plus';
import SplitterPanel from '../../components/SplitterPanel.vue';
import { ChatMessageSendType, Room, UserInfo } from '../../types/Types';
import { useI18n } from 'vue-i18n';
import { useRichText } from './useRichText';
import { generateUUID } from '../../utils';
import UploadFileList, { UploadFileListFile } from '../../components/UploadFileList/UploadFileList.vue';
import { Rectangle } from '../../components/DropFilePanel/DropFilePanel.vue';

const FILE_MAX_SIZE = 1024 * 1024 * 1024;

const props = defineProps<{
  room: Room
}>()

const isGroup = computed(() => props.room.type === ChatMessageSendType.Group)
const { t } = useI18n();

const currentUserStore = useCurrentUserStore();
const { getRoomMessage } = useChatMessage()

const messageContent = ref<string>("")
const messageListBox = ref<InstanceType<typeof ElScrollbar> | null>(null)
const messageBox = ref<HTMLDivElement | null>(null)
const { height: messageBoxHeight } = useElementSize(messageBox)

const { loadData,
  messages,
  sendText,
  sendFile,
  clearUnread,
  hasMore,
  sendAttachment
} = getRoomMessage(props.room.id)

loadData(true)

const messageBoxScrollDown = (animation: boolean = true) => {
  messageListBox.value?.scrollTo({
    top: messageBoxHeight.value,
    behavior: animation ? "smooth" : "auto",
  })
}

const { isActive, pause, resume } = watchPausable(
  messageBoxHeight,
  () => messageBoxScrollDown(false),
)

const loadMoreData = useThrottleFn(() => {
  loadData()
}, 1000)

const messageEditor = ref<HTMLDivElement>()

useRichText(messageEditor)

const messageListScrollHandle = (e: { scrollLeft: number, scrollTop: number }) => {
  if ((messageListBox.value?.wrapRef?.clientHeight ?? 0) + e.scrollTop + 60 <= messageBoxHeight.value) {
    pause();
  } else {
    resume();
  }

  if (props.room.unreadCount > 0 && e.scrollTop + (messageListBox.value?.wrapRef?.clientHeight ?? 0) + 40 > messageBoxHeight.value) {
    clearUnread()
  }

  if (e.scrollTop < 200 && hasMore) {
    // load more data.
    loadMoreData()
  }
}

const moveEnd = () => {
  messageListBox.value?.update()
}

const isSelf = (formId: number): boolean => {
  return formId === currentUserStore.userInfo?.id
}

const send = async () => {
  await sendText(messageContent.value)
  messageContent.value = ''
  !isActive.value && messageBoxScrollDown(true)
}

const { open, onChange } = useFileDialog({
  reset: true
})

onChange(async (files) => {
  if (!files || files.length === 0) return;
  const file = files[0];
  if (file.size > FILE_MAX_SIZE) {
    ElNotification.warning(`The uploaded file size cannot be larger than ${FILE_MAX_SIZE / 1024 / 1024}`)
    return;
  }

  await sendFile(file)
  !isActive.value && messageBoxScrollDown(true)
})

const waitUploadFiles = shallowReactive<UploadFileListFile[]>([])

const fileDropHandle = async (files: File[] | null) => {
  if (!files) return;
  files.forEach(file => {
    waitUploadFiles.push({
      file,
      id: generateUUID()
    })
  })
}

const uploadFileList = ref<HTMLElement>()

const { bottom, left, width } = useElementBounding(uploadFileList)

const closeRect = ref<Rectangle | undefined>()

watchThrottled(
  [bottom, left, width],
  () => {
    closeRect.value = {
      x: left.value,
      y: bottom.value - 40,
      width: width.value,
      height: 40
    }
  },
  { throttle: 500 },
)

</script>

<style lang="scss" scoped>
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
  border-bottom: 1px solid var(--room-border-color);

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

header .el-icon {
  cursor: pointer;
  font-size: 26px;
  padding: 4px;
}

header .el-icon:hover {
  color: var(--primary);
}

.message-editor {
  padding: 1rem;
  min-height: 100px;
}

.message-editor:focus {
  outline: none;
}

.message-editor>:deep(img) {
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

.goto-bottom {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: var(--primary);
  font-size: 12px;
  color: white;
  padding: 4px 8px;
  animation: opacity 1s linear alternate infinite;
}

@keyframes opacity {
  to {
    opacity: .4;
  }
}
</style>
