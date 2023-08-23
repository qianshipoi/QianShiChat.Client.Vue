<template>
  <div class="text-message">
    {{ content }}
  </div>
</template>

<script setup lang='ts'>

defineProps<{
  content?: string
}>()

</script>

<style scoped>
.text-message {
  padding: 8px;
  text-align: left;
  white-space: pre-line;
}
</style>
