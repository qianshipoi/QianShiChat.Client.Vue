<template>
  <div class="friend">
    <div class="sessions">
      <div class="search">
        <el-input v-model="searchText" size="small" placeholder="搜索"></el-input>
        <button style="padding: 8px; font-weight: 600;">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
      </div>
      <ul>
        <li v-for="friend in friends" :key="friend.id">
          <UserItem :model-value="friend" @selected="selectedHandle" :is-selected="isSelected(friend)" />
        </li>
      </ul>
    </div>
    <div class="content">
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Plus } from '@element-plus/icons-vue'
import { useFriendStore } from '../store/useFriendStore';
import { storeToRefs } from 'pinia';
import { UserInfo } from '../types/Types';
const searchText = ref<string>('')

const friendStore = useFriendStore()
const { friends } = storeToRefs(friendStore)

friendStore.loadData()


const currentSelectedUser = ref<UserInfo>()

const isSelected = computed(() => (user: UserInfo) => currentSelectedUser.value === user)

const selectedHandle = (user: UserInfo) => {
  currentSelectedUser.value = user
}

</script>

<style scoped>
.friend {
  display: flex;
  height: 100%;
}

.sessions {
  width: 260px;
  height: 100%;
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
  background-color: #F2F2F2;
  height: 100%;
}
</style>
