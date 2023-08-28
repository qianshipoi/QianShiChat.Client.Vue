<template>
  <el-image class="image-message" :preview-src-list="[content.rawPath]" :src="content.previewPath" fit="cover"
    :lazy="true">
    <template #error>
      <div class="image-slot">
        Not Found
      </div>
    </template>
  </el-image>
</template>

<script setup lang='ts'>
import { Attachment } from '../../types/Types';
defineProps<{
  content: Attachment
}>()
</script>

<style scoped>
.image-message {
  display: block;
  min-width: 80px;
  max-width: 200px;
  max-height: 240px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 20px;
  font-weight: 600;
}
</style>
