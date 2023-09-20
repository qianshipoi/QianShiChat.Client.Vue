<template>
  <div class="qs-tab-panel">
    <slot />
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  label?: string
}>()
</script>

<style lang="scss" scoped>
</style>
