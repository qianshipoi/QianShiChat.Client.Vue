<template>
  <el-image class="image-message" :preview-src-list="[content.rawPath]" :src="content.previewPath" fit="cover"
    :lazy="true"></el-image>
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
  max-width: 200px;
  max-height: 240px;
  font-size: 0;
}
</style>
