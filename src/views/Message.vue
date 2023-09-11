<template>
  <div class="message">
    <div class="room-list">
      <div class="search">
        <el-input v-model="searchText" style="background-color: var(--input-bg-color);" size="small"
          placeholder="搜索"></el-input>
        <button style="padding: 8px; font-weight: 600; background-color: var(--input-bg-color); border-radius: 4px;"
          @click="addFriendVisible = true">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
      </div>
      <ul>
        <li v-for="room in rooms" :key="room.id">
          <RoomItem :model-value="(room as RoomType)" @selected="roomStore.openRoom(room.id)"
            :is-selected="roomStore.isOpend(room.id)" />
        </li>
      </ul>
    </div>
    <div class="content">
      <Room v-if="roomStore.isOpendRoom" :key="roomStore.opendRoomRaw?.id" :room="roomStore.opendRoomRaw!" />
    </div>
    <add-friend-search v-model="addFriendVisible"></add-friend-search>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../store/useRoomStore';
import {  Room as RoomType } from '../types/Types';
import { Plus } from '@element-plus/icons-vue'
import Room from './message/Room.vue'
import AddFriendSearch from '../components/AddFriendSearch.vue';
import RoomItem from '../components/RoomItem.vue';

const roomStore = useRoomStore();
const {  rooms } = storeToRefs(roomStore);
const searchText = ref<string>('')
const addFriendVisible = ref<boolean>(false)
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
</style>
