<template>
  <label class="comic-switch">
    <input type="checkbox" v-model="value" class="toggle">
    <span class="slider"></span>
    <span class="card-side"></span>
    <slot></slot>
  </label>
</template>

<script setup lang='ts'>
const value = defineModel<boolean>()
</script>

<style lang="css">
@import url('../../assets/css/comicGlobal.css');
</style>
<style scoped>
.comic-switch {
  transform: translateY(-200px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  width: 50px;
  height: 20px;
}

.card-side::before {
  position: absolute;
  content: 'Log in';
  left: -70px;
  top: 0;
  width: 100px;
  text-decoration: underline;
  color: var(--comic-font-color);
  font-weight: 600;
}

.card-side::after {
  position: absolute;
  content: 'Sign up';
  left: 70px;
  top: 0;
  width: 100px;
  text-decoration: none;
  color: var(--comic-font-color);
  font-weight: 600;
}

.toggle {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  box-sizing: border-box;
  border-radius: 5px;
  border: 2px solid var(--comic-main-color);
  box-shadow: 4px 4px var(--comic-main-color);
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--comic-bg-colorcolor);
  transition: 0.3s;
}

.slider:before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  border: 2px solid var(--comic-main-color);
  border-radius: 5px;
  left: -2px;
  bottom: 2px;
  background-color: var(--comic-bg-color);
  box-shadow: 0 3px 0 var(--comic-main-color);
  transition: 0.3s;
}

.toggle:checked+.slider {
  background-color: var(--comic-input-color);
}

.toggle:checked+.slider:before {
  transform: translateX(30px);
}

.toggle:checked~.card-side:before {
  text-decoration: none;
}

.toggle:checked~.card-side:after {
  text-decoration: underline;
}
</style>
