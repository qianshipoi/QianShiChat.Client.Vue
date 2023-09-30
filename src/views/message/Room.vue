<template>
  <div class="room">
    <div style="overflow: hidden; height: 100%; padding: 1rem;">
      <DropFilePanel style="" @drop="fileDropHandle" :close-rect="closeRect">
        <div class="message-box">

          <header>
            <div class="left">
              <span>{{ room.name }}</span>
              <span v-if="!isGroup">
                [{{ (room.toObject as UserInfo).isOnline ? t('status.online') : t('status.offline')
                }}]
              </span>
            </div>
          </header>

          <div class="content">
            <div class="message-content" style="position: relative;">
              <el-scrollbar @scroll="messageListScrollHandle" ref="messageListBox">
                <div ref="messageBox" style="margin-top: 68px;">
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
              <UploadFileList ref="uploadFileList" class="upload-file-list" @completed="sendAttachment"
                :files="waitUploadFiles" />
            </div>
            <div class="message-input-box">
              <AudioRecorder class="message-input-audio" v-if="showAudioRecorder" @back="showAudioRecorder = false"
                @completed="audioRecordCompletedHandle" />
              <div v-else class="message-input-text">
                <input type="text" v-model="messageContent" ref="messageInputRef" placeholder="Write your message...">
                <div class="actions">
                  <el-popover ref="iconPopover" placement="top" :width="200" trigger="click">
                    <template #reference>
                      <button class="icon">
                        <Icon icon="fluent:emoji-16-filled" />
                      </button>
                    </template>
                    <EmojiPanel @selected="iconSelectedHandle" />
                  </el-popover>
                  <button class="icon" @click="showAudioRecorder = true">
                    <Icon icon="typcn:microphone" />
                  </button>
                  <button class="icon" @click="() => addAttachmentHandle()">
                    <Icon icon="ri:attachment-2" />
                  </button>
                  <button class="icon send" :disabled="!messageContent" @click="send">
                    <Icon icon="mingcute:send-fill" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DropFilePanel>
    </div>

    <div class="profile" :style="{ width: profileWidth }">
      <button @click="expandProfile = true" v-if="!expandProfile">
        <Icon icon="icon-park-solid:expand-left"></Icon>
      </button>
      <button @click="expandProfile = false" v-else>
        <Icon icon="icon-park-solid:expand-right"></Icon>
      </button>
      <img class="avatar" :src="room.avatar" alt="user avatar">
      <div v-if="expandProfile" class="name animate__animated animate__slideInUp">
        {{ room.name }}
      </div>

    </div>
  </div>
</template>

<script setup lang='ts'>
import { Icon } from '@iconify/vue';
import { ArrowDownBold } from '@element-plus/icons-vue';
import { useElementBounding, useElementSize, useFileDialog, useThrottleFn, watchPausable, watchThrottled } from '@vueuse/core';
import { useChatMessage } from './useChatMessage';
import ChatMessage from '../../components/ChatMessage/index.vue';
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { ElScrollbar } from 'element-plus';
import { ChatMessageSendType, Room, UserInfo } from '../../types/Types';
import { useI18n } from 'vue-i18n';
import { useRichText } from './useRichText';
import { generateUUID } from '../../utils';
import UploadFileList, { UploadFileListFile } from '../../components/UploadFileList/UploadFileList.vue';
import { Rectangle } from '../../components/DropFilePanel/DropFilePanel.vue';
import { ElPopover } from 'element-plus'

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

const expandProfile = ref(false)
const profileWidth = computed(() => expandProfile.value ? '240px' : '60px')

const {
  loadData,
  messages,
  sendText,
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

const loadMoreData = useThrottleFn(() => loadData(), 1000)

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

const isSelf = computed(() => (formId: number): boolean => {
  return formId === currentUserStore.userInfo?.id
})

const send = async () => {
  await sendText(messageContent.value)
  messageContent.value = ''
  !isActive.value && messageBoxScrollDown(true)
}

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

const { open: addAttachmentHandle, onChange } = useFileDialog({
  accept: '*',
  multiple: true,
  reset: true
})

onChange(files => {
  if (!files) {
    return;
  }
  const f: File[] = []
  for (const file of files) {
    f.push(file)
  }
  fileDropHandle(f);
})

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

const messageInputRef = ref<HTMLInputElement>()

const iconPopover = ref<InstanceType<typeof ElPopover>>()

const iconSelectedHandle = (emoji: string) => {
  messageContent.value += emoji
  iconPopover.value?.hide()
  nextTick(() => {
    messageInputRef.value?.focus()
  })
}

const showAudioRecorder = ref(false)
const audioRecordCompletedHandle = (file: File) => {
  showAudioRecorder.value = false
  waitUploadFiles.push({
    file,
    id: generateUUID()
  })
}

watch(() => showAudioRecorder.value, () => nextTick(() => messageListBox.value?.update()))

const messageInputBoxHeight = computed(() => showAudioRecorder.value ? '140px' : '54px')

</script>

<style lang="scss" scoped>
.room {
  --border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr auto;
  height: 100%;
}

.message-box {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #EDF0F5;
  border-radius: var(--border-radius);
  overflow: hidden;

  header {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    overflow: hidden;
    padding: 4px 18px;
    height: 68px;
    z-index: 2;

    backdrop-filter: blur(30px);
    background-color: rgba(255, 255, 255, 0.088);
    border: 1px solid rgba(255, 255, 255, 0.089);

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

  .content {
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 8px;
    flex: 1;
    overflow: hidden;
  }

  .message-content {
    position: relative;
    overflow: hidden;
  }
}

.profile {
  padding: 1rem 1rem 1rem 0;
  width: 60px;
  height: 100%;
  transition: width .3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &>button {
    padding: 0.5rem;
    border-radius: 4px;
  }

  &>.avatar {
    width: 100%;
    max-width: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
    user-select: none;
    -webkit-user-drag: none;
  }

  &>.name {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
}


.upload-file-list {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.5rem;
}

.message-input-box {
  margin: 0 1rem 1rem;
  box-shadow: 0 1px 8px #cccccc80;
  background-color: white;
  border-radius: var(--border-radius);
  transition: height .3s ease;
  height: v-bind(messageInputBoxHeight);
  overflow: hidden;
}

.message-input-audio {
  padding: 1rem;
  height: 140px;
}

.message-input-text {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  height: 52px;
  padding: 6px;

  &>input {
    height: 100%;
    border: none;
    outline: none;
    margin: 0 0 0 8px;
  }

  &>.actions {
    display: flex;
    gap: 8px;

    &>.icon {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #D6DCE4;
      font-size: 18px;
      padding: 0;
      outline: none;
      background-color: transparent;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: .1s ease-in-out;

      &:hover {
        border: none;
      }

      &.send {
        background-color: #00A389;
        color: white;

        &:disabled {
          background-color: rgba($color: #00A389, $alpha: .6);
          cursor: not-allowed;
        }

        &:active {
          transform: scale(.9);
        }
      }


      &:hover:not(:last-child) {
        color: #00A389;
        transform: scale(1.2);
      }
    }
  }

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
