<template>
  <div :class="['room-item', isSelected ? 'selected' : '']" @click="$emit('selected', room!)"
    @click.right.native="showContextMenu">
    <div class="avatar">
      <el-image style="width: 100%;height: 100%;" :src="room?.avatar" fit="cover"></el-image>
    </div>
    <div class="content">
      <div class="up">
        <span class="name">{{ room?.name }}</span>
        <span class="time">{{ timeFormat(room?.lastMessageTime) }}</span>
      </div>
      <div class="down">
        <span class="message">{{ content }}</span>
        <span class="unread" v-if="(room?.unreadCount ?? 0) > 0">{{ room?.unreadCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Room } from '../types/Types';
import { timeFormat } from '../utils/timeUtils'
import contextMenu from './ContextMenu';
import { MenuAction } from './ContextMenu/ContextMenu.vue';

defineProps<{
  isSelected?: boolean
}>()
const room = defineModel<Room>()
const emits = defineEmits<{
  (event: "selected", val: Room): void
  (event: "delete", val: Room): void
  (event: "read", val: Room): void
}>()

const showContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  contextMenu(e,
    [
      { label: '删除', value: 'delete' },
      { label: '标记已读', value: 'read' }
    ],
    (action: MenuAction) => {
      if (action.value === 'delete') {
        emits('delete', room.value!)
      } else if (action.value === 'read') {
        emits('read', room.value!)
      }
    })
}

const content = computed(() => {
  if (typeof room.value?.lastMessageContent === 'string') {
    return room.value.lastMessageContent
  } else {
    return room.value?.lastMessageContent?.name
  }
})

</script>

<style lang="scss" scoped>
.room-item {
  display: grid;
  grid-template-columns: auto 1fr;
  padding: 0 10px;
  align-items: center;
  height: 70px;
  gap: 10px;
  border-radius: 10px;
  overflow: hidden;
  transition: all .3s ease;

  &:hover {
    background-color: var(--item-hover-color);
  }

  &.selected {
    background-color: var(--item-active-color);
    color: white;
  }
}


.room-item.selected .message,
.room-item.selected .time {
  color: white;
}

.avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.up,
.down {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.down {
  display: grid;
  grid-template-columns: 1fr auto;
}

.name,
.message {
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message {
  color: #999999;
}

.time {
  font-size: 10px;
  color: #CCCCCC;
}

.unread {
  display: flex;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 50%;
  align-items: center;
  height: 20px;
  font-weight: 600;
  font-size: 12px;
  transform: scale(.8);
  color: white;
  background-color: #C4C4C4;
  overflow: hidden;
}
</style>
