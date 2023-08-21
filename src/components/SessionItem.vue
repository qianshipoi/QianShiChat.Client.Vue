<template>
  <div :class="['session-item', isSelected ? 'selected' : '']" @click="selected">
    <div class="avatar">
      <el-image style="width: 100%;height: 100%;" :src="session?.avatar" fit="cover" :lazy="true"></el-image>
    </div>
    <div class="content">
      <div class="up">
        <span class="name">{{ session?.name }}</span>
        <span class="time">{{ timeFormat(session?.lastMessageTime) }}</span>
      </div>
      <div class="down">
        <span class="message">{{ session?.lastContent }}</span>
        <span class="unread">{{ session?.unreadCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import * as dayjs from 'dayjs'
import * as isToday from 'dayjs/plugin/isToday'
import { Session } from '../types/Types';

defineProps<{
  isSelected?: boolean
}>()

const session = defineModel<Session>()

const emits = defineEmits<{
  (event: "selected", val: Session): void
}>()

dayjs.extend(isToday);

const selected = () => {
  emits('selected', session.value!);
}

const isLessThenOneWeek = (date: dayjs.Dayjs): boolean => {
  const aWeekAge = dayjs(new Date()).subtract(1, "week")
  return aWeekAge.get("second") < date.get("second")
}

const timeFormat = (time?: number) => {
  if (!time) {
    return '';
  }
  const date = dayjs(time);
  const isToday = date.isToday()

  if (isToday) {
    return `${date.hour()}:${date.minute()}`
  } else if (isLessThenOneWeek(date)) {
    return date.format("dd")
  } else {
    return date.format("YYYY/MM/DD")
  }
}

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
  background-color: #F5F5F5;
}

.session-item.selected {
  background-color: #0099FF;
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
}

.name,
.message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread {
  display: flex;
  justify-content: center;
  padding: 2px 4px;
  border-radius: 12px;
  align-items: center;
  font-weight: 600;
  font-size: 10px;
  color: white;
  background-color: #C4C4C4;
  overflow: hidden;
}
</style>
