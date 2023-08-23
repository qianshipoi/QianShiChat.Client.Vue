<template>
  <el-image :preview-src-list="[content.rawPath]" :src="content.previewPath" fit="cover"
    style="max-width: 200px; max-height: 240px;" :lazy="true"></el-image>
</template>

<script setup lang='ts'>
import { Attachment } from '../../types/Types';
defineProps<{
  content: Attachment
}>()
</script>
