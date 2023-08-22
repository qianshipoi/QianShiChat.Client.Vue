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
  background-color: white;
  padding: 8px;
}
</style>
