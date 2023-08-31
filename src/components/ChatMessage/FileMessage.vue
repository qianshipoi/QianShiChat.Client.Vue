<template>
  <el-popover ref="popover" placement="top" :width="200" trigger="contextmenu">
    <template #reference>
      <div class="file-message">
        <span class="name">{{ content.name }}</span>
        <div class="icon">
          {{ fileExt }}
        </div>
        <span class="description">{{ filterSize(content.size) }}</span>
      </div>
    </template>
    <ul class="menu-actions">
      <li @click="download">下载</li>
      <li>转发</li>
    </ul>
  </el-popover>
</template>

<script setup lang='ts'>
import { downloadFile, filterSize, getFileExt } from '../../utils/index'
import { Attachment } from '../../types/Types';
import { PopoverInstance } from 'element-plus'
const props = defineProps<{
  content: Attachment
}>()

const popover = ref<PopoverInstance | null>()

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
  popover.value?.hide();
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
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.name {
  font-size: 14px;
}

.description {
  font-size: 12px;
  color: gray;
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

