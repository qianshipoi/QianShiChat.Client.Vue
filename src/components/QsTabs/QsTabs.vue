<template>
  <div class="container">
    <div class="tabs">
      <div class="tab" v-for="(tab) in tabs" :key="tab.key ?? tab.title" @click="tabClickHandle(tab)">
        {{ tab.title }}
      </div>
      <span class="glider"></span>
    </div>
    <div class="content">
      <component v-for="item in defaults" :is="item" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import QsTabPanel from './QsTabPanel.vue';

const slots = useSlots()
const defaults = slots.default && slots.default();

defaults?.forEach(tag => {
  if (tag.type != QsTabPanel) {
    throw new Error('QsTabs the child must be a QsTabPanel component.')
  }
})

type TabItem = {
  id: number;
  title?: string;
  key?: symbol | number | string;
}
const tabs: TabItem[] = []

defaults?.forEach(tabPanel => {
  tabs.push({
    id: tabs.length,
    title: tabPanel.props?.label,
    key: tabPanel.props?.key
  })
});

const props = defineProps<{
  selected?: string
}>()
const emits = defineEmits<{
  (e: 'update:selected', value: string | undefined): void
}>()


const tabClickHandle = (item: TabItem) => {
  emits('update:selected', item.title)
}

const transform = computed(() => {
  let index = tabs.findIndex(x => x.title === props.selected);
  if (index === -1) index = 0;
  return index * 100 + '%';
})
watchEffect(() => {
  console.log(props.selected);
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tabs {
  display: flex;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(#185ee0, 0.15), 0 6px 12px 0 rgba(#185ee0, 0.15);
  padding: 0.75rem;
  border-radius: 99px; // just a high number to create pill effect

  * {
    z-index: 2;
  }
}


.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 200px;
  font-size: 1.25rem;
  font-weight: 500;
  border-radius: 99px; // just a high number to create pill effect
  cursor: pointer;
  transition: color 0.15s ease-in;
}

.glider {
  position: absolute;
  display: flex;
  height: 54px;
  width: 200px;
  background-color: var(--primary);
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
  transform: translate(v-bind(transform));
}

@media (max-width: 700px) {
  .tabs {
    transform: scale(0.6);
  }
}
</style>
