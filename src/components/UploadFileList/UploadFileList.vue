<template>
  <TransitionGroup tag="div" name="file-list" class="upload-file-list">
    <UploadFileControl ref="uploadFileControlRefs" @cancel="cancelHandle(file.id)"
      @completed="(attachment) => completedHandle(file, attachment)" v-for="(file) in queue" :key="file.id"
      :file="file.file" />
  </TransitionGroup>
</template>

<script setup lang='ts'>
import { watchArray } from '@vueuse/core';
import { Attachment } from '../../types/Types';
import UploadFileControl from '../UploadFileControl/UploadFileControl.vue'
import { delay } from '../../utils/index'

export interface UploadFileListFile {
  file: File,
  id: string
}

export interface UploadFileListProps {
  files: UploadFileListFile[],
  maxCount?: number
}

const emits = defineEmits<{
  (e: 'completed', attachment: Attachment): void
}>()

const props = withDefaults(defineProps<UploadFileListProps>(), {
  maxCount: 3
})

const queue: UploadFileListFile[] = reactive([])
const uploadFileControlRefs = ref<InstanceType<typeof UploadFileControl>[]>()

const addQueue = async () => {
  if (queue.length >= props.maxCount) {
    return
  }
  for (let i = 0;i < props.files.length;i++) {
    const file = props.files[i];
    if (queue.find(x => x.id === file.id)) {
      continue;
    }
    queue.push(file);
    await nextTick()
    if (uploadFileControlRefs.value && uploadFileControlRefs.value.length > 0) {
      const control = uploadFileControlRefs.value[uploadFileControlRefs.value.length - 1]
      setTimeout(() => {
        control.start();
      }, 1000)
    }
    if (queue.length >= props.maxCount) {
      break;
    }
  }
}

const removeQueue = (removed: UploadFileListFile[]) => {
  removed.forEach(async files => {
    const index = queue.findIndex(x => x.id === files.id);
    if (index !== -1) {
      queue.splice(index, 1);
      await delay(1000)
    }
  });
  addQueue();
}

watchArray(props.files, (_newList, _oldList, added, removed) => {
  if (added.length > 0) addQueue()
  if (removed.length > 0) removeQueue(removed)
})

const cancelHandle = (id: string) => {
  props.files.splice(props.files.findIndex(x => x.id === id), 1)
}

const completedHandle = (file: UploadFileListFile, attachment: Attachment) => {
  cancelHandle(file.id);
  emits('completed', attachment)
}

</script>

<style lang="scss" scoped>
.upload-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-list-move,
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.5s ease;
}

.file-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.file-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.file-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
