<template>
  <div class="drop-panel" ref="dropPanel">
    <slot />
    <Transition name="modal">
      <div class="drop-panel-modal" v-show="isOverDropZone">
        <Vue3Lottie :animation-data="uploadJSON" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang='ts'>
import { useDropZone, useEventListener } from '@vueuse/core';
import { Vue3Lottie } from 'vue3-lottie';
import uploadJSON from '../../assets/json/upload.json'

const dropPanel = ref<HTMLDivElement>()

const emits = defineEmits<{
  (e: 'drop', files: File[]): void
}>()

const { isOverDropZone } = useDropZone(document.body)

const includeFolder = (items: DataTransferItemList | null | undefined) => {
  if (!items) return
  for (let i = 0;i <= items.length - 1;i++) {
    let item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry()
      if (entry?.isDirectory) {
        return true
      }
    }
  }
  return false
}

useEventListener(dropPanel, 'drop', (event: DragEvent) => {
  event.preventDefault()
  if (includeFolder(event.dataTransfer?.items)) {
    ElNotification.warning('不支持文件夹')
    return;
  }
  const files = event.dataTransfer?.files
  if (files && files?.length > 0) {
    const fileArray: File[] = []
    for (let i = 0;i < files.length;i++) {
      const file = files[i];
      fileArray.push(file);
    }
    emits('drop', fileArray)
    return;
  }
})

</script>

<style lang="scss" scoped>
.drop-panel {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.drop-panel-modal {
  --padding: 20px;
  position: absolute;
  z-index: 999;
  top: var(--padding);
  left: var(--padding);
  right: var(--padding);
  bottom: var(--padding);
  border-radius: 12px;
  border: 2px dashed black;
  overflow: hidden;
  box-sizing: border-box;
  background-color: rgba($color: #FFFDFF, $alpha: .8);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(.6);
}

.modal-leave-active {
  transition: all .3s ease-out;
}
</style>
