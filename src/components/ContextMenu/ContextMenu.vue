<template>
  <div class="context-menu" ref="contextMenu" v-if="visible" tabindex="-1" @blur="onClose">
    <ul class="actions">
      <li v-for="action in actions" @click="clickFunc(action)" :key="action.value">{{ action.label }}</li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
export type MenuAction = {
  label: string;
  value: string;
}

export type ContextMenuProps = {
  visible: boolean;
  actions: MenuAction[];
  onClick: (action: MenuAction) => void;
  onClose: () => void;
}

const props = defineProps<ContextMenuProps>();

const contextMenu = ref<HTMLDivElement>()
onMounted(async () => {
  await nextTick()
  contextMenu.value?.focus()
})

const clickFunc = (action: MenuAction) => {
  props.onClick(action)
  props.onClose();
}

</script>

<style >
.context-menu {
  position: fixed;
  border-radius: 6px;
  border: 1px solid rgba(222, 222, 222, 0.5);
  background-color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  z-index: 1000;
  box-shadow: 0 0 6px rgba(0, 0, 0, .1);

  &:focus {
    outline: none;
  }

  &>.actions {
    padding: 8px;

    &>li {
      border-radius: 4px;
      padding: 4px 2rem;
      cursor: pointer;
      transition: all .3s ease;

      &:hover {
        background-color: #66C8B8;
        color: white;
      }
    }
  }
}
</style>
