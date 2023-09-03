<template>
  <div :class="['user-item', isSelected ? 'selected' : '']" @click="selected">
    <div class="avatar">
      <el-image style="width: 100%;height: 100%;" :src="user?.avatar" fit="cover" :lazy="true"></el-image>
    </div>
    <div class="content">
      <div class="up">
        <span class="name">{{ user?.nickName }}</span>
      </div>
      <div class="down">
        <span class="message">描述</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { UserInfo } from '../types/Types';


defineProps<{
  isSelected?: boolean
}>()

const emits = defineEmits<{
  (event: "selected", val: UserInfo): void
}>()

const user = defineModel<UserInfo>()

const selected = () => {
  emits('selected', user.value!);
}

</script>

<style scoped>
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
  justify-content: space-between;
}

.name,
.message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
