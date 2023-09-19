<template>
  <div class="context-menu" ref="contextMenu" v-if="showData.name" tabindex="-1" @blur="onClose">
    <ul class="actions">
      <li v-for="action in actions" @click="clickFunc(action)" :key="action.value">{{ action.label }}</li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps<{
  data?: any;
  onClose: () => void;
}>();

export type MenuAction = {
  label: string;
  value: string
}

const actions: MenuAction[] = [
  { label: '删除', value: 'delete' }
]

const showData = computed(() => {
  let data: any = {},
    pd = props.data
  if (pd) {
    data.name = pd.name
  }
  return data;
})

const contextMenu = ref<HTMLDivElement>()
onMounted(async () => {
  await nextTick()
  contextMenu.value?.focus()
})

const clickFunc = (action: MenuAction) => {
  props.data.onClick(action)
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

  &:focus {
    outline: none;
  }

  &>.actions {
    padding: 8px;

    &>li {
      border-radius: 4px;
      padding: 4px 8px;
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
