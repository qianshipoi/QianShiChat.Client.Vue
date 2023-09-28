<template>
  <comic-switch v-model="value">
    <div class="flip-card__inner">
      <div class="flip-card__front">
        <slot name="front"></slot>
      </div>
      <div class="flip-card__back">
        <slot name="back"></slot>
      </div>
    </div>
  </comic-switch>
</template>

<script setup lang='ts'>
const value = defineModel<boolean>()
</script>

<style lang="css">
@import url('../../assets/css/comicGlobal.css');
</style>
<style scoped>
.flip-card__inner {
  width: 300px;
  height: 350px;
  position: relative;
  background-color: transparent;
  perspective: 1000px;
  /* width: 100%;
    height: 100%; */
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.toggle:checked~.flip-card__inner {
  transform: rotateY(180deg);
}

.toggle:checked~.flip-card__front {
  box-shadow: none;
}

.flip-card__front,
.flip-card__back {
  padding: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background: lightgrey;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--comic-main-color);
  box-shadow: 4px 4px var(--comic-main-color);
}

.flip-card__back {
  width: 100%;
  transform: rotateY(180deg);
}

.flip-card__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--comic-main-color);
}
</style>
