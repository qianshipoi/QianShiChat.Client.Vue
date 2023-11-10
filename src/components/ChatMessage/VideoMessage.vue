<template>
  <div class="video-message">
    <video :src='content.rawPath' controls></video>
  </div>
</template>

<script setup lang='ts'>
import { Attachment } from '../../types/Types';

defineProps<{
  content: Attachment
}>()

</script>

<style lang="scss" scoped>
.video-message {
  display: block;
  min-width: 80px;

  video {
    display: flex;
    width: 100%;
  }
}
</style>
