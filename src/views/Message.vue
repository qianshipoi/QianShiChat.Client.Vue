<template>
  <div class="message">
    <div class="room-list">
      <div class="search">
        <el-input v-model="searchText" style="background-color: var(--input-bg-color);" size="small"
          placeholder="搜索"></el-input>
        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <button style="padding: 8px; font-weight: 600; background-color: var(--input-bg-color); border-radius: 4px;">
              <el-icon>
                <Plus />
              </el-icon>
            </button>
          </template>
          <ul class="menu-actions">
            <li @click="addFriendVisible = true">add friend</li>
            <li @click="displayCreateGroup = true">create group</li>
          </ul>
        </el-popover>
      </div>
      <ul>
        <li v-for="room in rooms" :key="room.id">
          <RoomItem @delete="roomStore.removeRoom" :model-value="(room as RoomType)"
            @selected="roomStore.openRoom(room.id)" :is-selected="roomStore.isOpend(room.id)" />
        </li>
      </ul>
    </div>
    <div class="content">
      <Room v-if="roomStore.isOpendRoom" :key="roomStore.opendRoomRaw?.id" :room="roomStore.opendRoomRaw!" />
      <Vue3Lottie v-else :loop="false" :animation-data="messagesJSON" />
    </div>
    <add-friend-search v-model="addFriendVisible"></add-friend-search>
    <CreateGroup v-if="displayCreateGroup" v-model="displayCreateGroup" />
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/useRoomStore';
import { Room as RoomType } from '../types/Types';
import { Plus } from '@element-plus/icons-vue'
import Room from './message/Room.vue'
import AddFriendSearch from '../components/AddFriendSearch.vue';
import RoomItem from '../components/RoomItem.vue';
import CreateGroup from '../components/CreateGroup/CreateGroup.vue'
import { Vue3Lottie } from 'vue3-lottie';
import messagesJSON from '../assets/json/messages.json'

const roomStore = useRoomStore();
const { rooms } = storeToRefs(roomStore);
const searchText = ref<string>('')
const addFriendVisible = ref<boolean>(false)
const displayCreateGroup = ref<boolean>(false)
</script>

<style scoped>
.message {
  display: flex;
  height: 100%;
}

.room-list {
  width: 260px;
  height: 100%;
  background-color: var(--room-list-bg-color);
}

.search {
  display: flex;
  gap: 8px;
  margin: 20px 8px;
}

.search>.el-input {
  flex: 1;
}

.content {
  flex: 1;
  height: 100%;
  background-color: var(--room-bg-color);
}


.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &>li {
    padding: 8px;
    border-radius: 4px;
    transition: all .3s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--primary);
      color: white;
    }
  }
}
</style>
