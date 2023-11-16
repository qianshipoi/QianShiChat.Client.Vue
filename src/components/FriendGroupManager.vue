<template>
  <VueDraggable ref="el" v-model="list" :disabled="disabled" :animation="150" ghostClass="ghost" @start="onStart"
    target=".sort-target" handle=".handle" @update="onUpdate">
    <TransitionGroup type="transition" tag="ul" name="fade"
      style="display: flex; flex-direction: column; padding: 12px; width: 300px; height: 300px; margin: 0 auto; background-color: gray; border-radius: 12px; gap: 8px;"
      class="sort-target">
      <li v-for="item in list" :key="item.id"
        style="background-color: #ccc; border-radius: 5px; padding: 6px; display: flex; align-items: center; gap: 12px;">
        <span class="handle" style="cursor: move;">■</span>
        <span>{{ item.name }}</span>
      </li>
    </TransitionGroup>
  </VueDraggable>
</template>

<script setup lang='ts'>
import { type UseDraggableReturn, VueDraggable } from 'vue-draggable-plus'
const list = ref([
  {
    name: 'Joao',
    id: 1
  },
  {
    name: 'Jean',
    id: 2
  },
  {
    name: 'Johanna',
    id: 3
  },
  {
    name: 'Juan',
    id: 4
  }
])

const el = ref<UseDraggableReturn>()
const disabled = ref(false)

const onStart = () => {
  console.log('start')
}

const onUpdate = () => {
  console.log('update')
}
</script>

<style>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>
