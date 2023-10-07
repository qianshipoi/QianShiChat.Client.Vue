<template>
  <input class="flip-card__input" :autofocus="autofocus" v-model="value" :style="style" :name="name" :placeholder="placeholder" :type="type">
</template>

<script setup lang='ts'>
import { CSSProperties } from 'vue';

interface Props {
  style?: CSSProperties
  name?: string
  placeholder?: string
  type?: string
  autofocus?: boolean
}

defineProps<Props>();

const value = defineModel<string | number>()

</script>

<style lang="css">
@import url('../../assets/css/comicGlobal.css');
</style>
<style scoped>
.flip-card__input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--comic-main-color);
  background-color: var(--comic-bg-color);
  box-shadow: 4px 4px var(--comic-main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--comic-font-color);
  padding: 5px 10px;
  outline: none;
}

.flip-card__input::placeholder {
  color: var(--comic-font-color-sub);
  opacity: 0.8;
}

.flip-card__input:focus {
  border: 2px solid var(--comic-input-color);
}
</style>
