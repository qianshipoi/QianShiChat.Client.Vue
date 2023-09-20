<template>
  <div class="container">
    <div class="tabs">
      <div ref="selectedItems" :class="['tab', { 'selected': selected === tab.key }]" v-for="(tab) in tabs"
        :key="tab.key ?? tab.title" @click="tabClickHandle(tab)">
        {{ tab.title }}
      </div>
      <span class="glider" :style="gliderStyle"></span>
    </div>
    <div :style="{ transform: `translate(-${transform})` }" class="content" ref="indicator">
      <div :style="{ width: `${width}px` }" v-for="item in defaults" :key="item.props?.key">
        <component :is="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useCurrentElement, useElementBounding } from '@vueuse/core';
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
  defaultActiveKey?: string
}>()
const indicator = ref<HTMLDivElement>();
const selectedItems = ref<HTMLElement[]>([])

const selected = ref<string | symbol | number | undefined>(props.defaultActiveKey ?? tabs.length > 0 ? tabs[0].key : '')

const tabClickHandle = (item: TabItem) => {
  selected.value = item.key
}

const selectedIndex = computed(() => {
  let index = tabs.findIndex(x => x.key === selected.value);
  if (index === -1) index = 0;
  return index
})

const container = useCurrentElement<HTMLElement>();
const { width } = useElementBounding(container)

const transform = computed(() => selectedIndex.value * 100 + '%')

const { width: itemWidth } = useElementBounding(computed(() => selectedItems.value[selectedIndex.value]))

const gliderStyle = ref({
  width: "",
  transform: `translate(0)`
})

watchEffect(() => {
  gliderStyle.value.width = `${itemWidth.value}px`
  gliderStyle.value.transform = `translate(${transform.value})`
})

</script>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.tabs {
  display: flex;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(#185ee0, 0.15), 0 6px 12px 0 rgba(#185ee0, 0.15);
  padding: 0.5rem;
  border-radius: 99px;

  * {
    z-index: 2;
  }
}

.tab {
  padding: 4px 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
}

.selected {
  color: white;
}

.glider {
  position: absolute;
  display: flex;
  height: 32px;
  background-color: var(--primary);
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

@media (max-width: 700px) {
  .tabs {
    transform: scale(0.6);
  }
}

.content {
  margin-top: 10px;
  width: 100%;
  display: flex;
  white-space: nowrap;
  transition: 0.25s ease-out;

  &>div {
    min-height: 40px;
    flex-shrink: 0;
  }
}
</style>
