<template>
  <div class="file-message" @click.right.native="showContextMenu">
    <span class="name">{{ content.name }}</span>
    <div class="icon">
      {{ fileExt }}
    </div>
    <span class="description">{{ filterSize(content.size) }}</span>
  </div>
</template>

<script setup lang='ts'>
import { downloadFile, filterSize, getFileExt } from '../../utils/index'
import { Attachment } from '../../types/Types';
import contextMenu from '../ContextMenu';
import { MenuAction } from '../ContextMenu/ContextMenu.vue';
const props = defineProps<{
  content: Attachment
}>()

const showContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  contextMenu(e,
    [
      { label: '下载', value: 'download' },
      { label: '转发', value: 'share' }
    ],
    (action: MenuAction) => {
      if (action.value === 'download') {
        download()
      }
    })
}

const fileExt = computed(() => {
  let ext = getFileExt(props.content.rawPath)
  if (ext.length <= 1) {
    return 'F'
  }
  ext = ext.substring(1);
  if (ext.length > 3) {
    ext = ext.substring(0, 3);
  }
  return ext.toUpperCase();
})

const download = () => {
  const rawPath = toRaw(props.content).rawPath;
  downloadFile(rawPath);
}
</script>

<style lang="scss" scoped>
.file-message {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  padding: 12px 8px;
  width: 230px;
  height: 90px;
}

span {
  text-align: left;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--message-title-text-color);
  font-size: 12px;
  font-weight: 600;
}

.name {
  font-size: 14px;
  word-wrap: break-word;
}

.description {
  font-size: 12px;
  color: var(--message-description-text-color);
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &>li {
    padding: 8px;
    border-radius: 4px;
    transition: all .3s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--primary);
      color: white;
    }
  }
}
</style>

