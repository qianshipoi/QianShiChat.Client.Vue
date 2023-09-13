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
import { useDropZone } from '@vueuse/core';
import { Vue3Lottie } from 'vue3-lottie';
import uploadJSON from '../../assets/json/upload.json'

const dropPanel = ref<HTMLDivElement>()

const emits = defineEmits<{
  (e: 'drop', files: File[]): void
}>()

function onDrop(files: File[] | null) {
  files && emits('drop', files);
}

const { isOverDropZone } = useDropZone(dropPanel, onDrop)
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
