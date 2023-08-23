<template>
  <div style="position: relative; width: 100%; height: 100%;">
    <div class="wrapper" ref="wrapper">
      <div class="container">
        <div class="sidebar" ref="sidebar">
          <slot name="start" />
        </div>
        <div class="resizer" ref="resizer"></div>
        <div class="main">
          <slot name="end" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useElementBounding, useEventListener, useLocalStorage } from '@vueuse/core';

const props = withDefaults(defineProps<{
  startMinValue?: number
  endMinValue?: number,
  storageKey?: string
}>(), {
  startMinValue: 300,
  endMinValue: 200,
})

const emits = defineEmits<{
  (e: 'end'): void
}>()

let currentSplitPosition: Ref<string> = ref<string>('72%')
if (props.storageKey) {
  currentSplitPosition = useLocalStorage(props.storageKey, '72%')
}

const wrapper = ref<HTMLElement | null>(null)
const resizer = ref<HTMLElement | null>(null)
const sidebar = ref<HTMLElement | null>(null)

useEventListener(resizer, "mousedown", () => {
  document.addEventListener("mousemove", resize, false);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resize, false);
    emits("end")
  }, false);
})

const { top: wrapperOffsetTop } = useElementBounding(wrapper)

function resize(e: MouseEvent) {
  let offset = e.y - wrapperOffsetTop.value
  if (offset < props.startMinValue) {
    offset = props.startMinValue;
  }

  const size = `${offset}px`;
  sidebar.value!.style.flexBasis = size;
  currentSplitPosition.value = size;
}

onMounted(() => {
  sidebar.value!.style.flexBasis = currentSplitPosition.value;
})
</script>

<style scoped>
.wrapper {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar {
  height: 100%;
  position: relative;
  min-height: 0;
}

.resizer {
  flex-basis: 2px;
  background-color: #E9E9E9;
  position: relative;
  z-index: 2;
  cursor: row-resize;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main {
  flex-basis: 0;
  flex-grow: 1;
  min-height: 140px;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
