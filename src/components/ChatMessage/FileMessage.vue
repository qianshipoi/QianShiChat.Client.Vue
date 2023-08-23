<template>
  <div class="file-message">
    <span class="name">{{ content.name }}</span>
    <div class="icon"></div>
    <span class="description">{{ filterSize(content.size) }}</span>
  </div>
</template>

<script setup lang='ts'>
import { filterSize } from '../../utils/index'
import { Attachment } from '../../types/Types';
defineProps<{
  content: Attachment
}>()
</script>

<style scoped>
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
  background-color: rebeccapurple;
}

.name {
  font-size: 14px;
}

.description {
  font-size: 12px;
  color: gray;
}
</style>

