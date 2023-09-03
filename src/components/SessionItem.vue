<template>
  <div :class="['session-item', isSelected ? 'selected' : '']" @click="selected">
    <div class="avatar">
      <el-image style="width: 100%;height: 100%;" :src="session?.avatar" fit="cover"></el-image>
    </div>
    <div class="content">
      <div class="up">
        <span class="name">{{ session?.name }}</span>
        <span class="time">{{ timeFormat(session?.lastMessageTime) }}</span>
      </div>
      <div class="down">
        <span class="message">{{ content }}</span>
        <span class="unread" v-if="(session?.unreadCount ?? 0) > 0">{{ session?.unreadCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Session } from '../types/Types';
import { timeFormat } from '../utils/timeUtils'

defineProps<{
  isSelected?: boolean
}>()

const session = defineModel<Session | undefined>()

const emits = defineEmits<{
  (event: "selected", val: Session): void
}>()


const selected = () => {
  emits('selected', session.value!);
}

const content = computed(() => {
  if (typeof session.value?.lastMessageContent === 'string') {
    return session.value.lastMessageContent
  } else {
    return session.value?.lastMessageContent?.name
  }
})


</script>

<style scoped>
.session-item {
  display: flex;
  padding: 0 10px;
  align-items: center;
  height: 70px;
  gap: 10px;
  overflow: hidden;
  transition: all .3s ease;
}

.session-item:hover {
  background-color: var(--item-hover-color);
}

.session-item.selected {
  background-color: var(--item-active-color);
  color: white;
}

.session-item.selected .message,
.session-item.selected .time {
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
  justify-content: space-between;
  align-items: center;
}

.name,
.message {
  overflow: hidden;
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
