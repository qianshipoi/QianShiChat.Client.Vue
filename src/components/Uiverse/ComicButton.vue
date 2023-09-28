<template>
  <button class="flip-card__btn" type="button" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup lang='ts'>
interface Props {
  onClick: (e: MouseEvent) => void
}
defineProps<Props>();
</script>

<style lang="css">
@import url('../../assets/css/comicGlobal.css');
</style>
<style scoped>
.flip-card__btn:active {
  box-shadow: 0px 0px var(--comic-main-color);
  transform: translate(3px, 3px);
}

.flip-card__btn {
  margin: 20px 0 20px 0;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--comic-main-color);
  background-color: var(--comic-bg-color);
  box-shadow: 4px 4px var(--comic-main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--comic-font-color);
  cursor: pointer;
}
</style>
