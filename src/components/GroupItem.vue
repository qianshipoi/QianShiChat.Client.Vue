<template>
  <div :class="['user-item', isSelected ? 'selected' : '']" @click="emits('selected', group!)">
    <div class="avatar">
      <el-image style="width: 100%;height: 100%;" :src="group?.avatar" fit="cover" :lazy="true"></el-image>
    </div>
    <div class="content">
      <div class="up">
        <span class="name">{{ group?.name }}</span>
      </div>
      <div class="down">
        <span class="status">[{{ group?.totalUser }}]</span>
        <span class="message">描述</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Group } from '../types/Types';

defineProps<{
  isSelected?: boolean
}>()

const emits = defineEmits<{
  (event: "selected", val: Group): void
}>()

const group = defineModel<Group>()

</script>

<style lang="scss" scoped>
.user-item {
  display: flex;
  padding: 0 10px;
  align-items: center;
  height: 70px;
  gap: 10px;
  overflow: hidden;
  transition: all .3s ease;
}

.user-item:hover {
  background-color: var(--item-hover-color);
}

.user-item.selected {
  background-color: var(--primary);
  color: white;
}

.avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.up,
.down {
  display: flex;
  gap: 4px;

  .status {
    display: flex;
    align-items: center;

    .dot {
      display: block;
      width: 14px;
      height: 14px;
      background-color: var(--message-description-text-color);
      border-radius: 50%;
      margin: 0 2px;

      &.is-online {
        background-color: var(--success);
      }
    }
  }
}

.name,
.message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
