// from 'https://codepen.io/jheung/pen/jxgbLr'
<template>
  <div class="search-box">
    <input class="search-box__input" type="text" v-model="value" @keydown="$emit('keydown', $event)"
      oninput="this.setAttribute('value',this.value)">
    <i></i>
  </div>
</template>

<script setup lang='ts'>
defineEmits<{
  (e: 'keydown', event: KeyboardEvent): void
}>()
const value = defineModel<string>()

</script>

<style lang="scss" scoped>
$input-bg-color: var(--primary);
$input-text-color: #fff;
$animation-bounce: cubic-bezier(0.4, -1, 0.6, 2);

@keyframes blink {
  49% {
    opacity: 0;
  }

  50% {
    oppacity: 1;
  }

  51% {
    oppacity: 1;
  }

  52% {
    opacity: 0;
  }
}

.search-box {
  position: relative;

  &__input {
    width: 100%;
    height: 100%;
    background-color: $input-bg-color;
    caret-color: $input-bg-color;
    color: $input-text-color;
    border: 0;
    border-radius: 0.4em;
    padding: 0.25em 0.8em;
    font-size: 1em;
    box-shadow: 0 0 0.75em 0.25em rgba($input-bg-color, 0.2);
    transition: box-shadow 0.5s ease;

    // Adds shadow to input
    &:hover,
    &:focus {
      outline: 0;
      box-shadow: 0 0.5em 1.5em 0.25em rgba($input-bg-color, 0.2);
    }

    // Display Search Icon
    +i {
      position: absolute;
      width: 0.125em;
      height: 70%;
      border-radius: 0.2em;
      background-color: $input-text-color;

      left: 0.8em;
      top: 50%;
      transform: rotateZ(-45deg) translateY(-50%);
      transform-origin: top;
      transition: transform 0.5s $animation-bounce;

      &::before {
        content: "";
        display: block;
        position: relative;
        top: 0em;
        left: -0.3em;
        width: 0.5em;
        height: 0.5em;
        border-radius: 100%;
        border: 0.125em solid $input-text-color;
        background-color: $input-bg-color;

        transition: transform 0.5s $animation-bounce;
      }
    }

    // Display custom caret
    &:focus {
      +i {
        transform: rotateZ(0) translateY(-50%);
        animation: blink 1.1s infinite 0.5s;

        &::before {
          transform: rotateY(90deg);
        }
      }
    }

    // When value is not empty
    &[value]:not([value=""]) {
      caret-color: $input-text-color;

      +i {
        display: none;
      }
    }
  }
}
</style>
