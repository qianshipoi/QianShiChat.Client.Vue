<template>
  <ul class="emoji-panel">
    <li v-for="emoji in emojiArray" :key="emoji" @click="$emit('selected', emoji)">
      {{ emoji }}
    </li>
  </ul>
</template>

<script setup lang='ts'>
const emojiArray = ['😀', '😄', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃']
defineEmits<{
  (e: 'selected', emoji: string): void
}>()
</script>

<style lang="scss" scoped>
.emoji-panel {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;

  &>li {
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all .1s ease-in;
    font-size: 16px;

    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
