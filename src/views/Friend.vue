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

      <div style="display: flex; flex-direction: column;gap: 8px;">
        <button @click="openFriendApply">好友通知</button>
        <button>群通知</button>
      </div>

      <ul>
        <li v-for="friend in friends" :key="friend.id">
          <UserItem :model-value="friend" @selected="selectedHandle" :is-selected="isSelected(friend)" />
        </li>
      </ul>
    </div>
    <div class="content">
      <component v-if="opendComponent" v-bind="componentProps" :is="opendComponent" />
      <!-- <UserProfile v-if="currentSelectedUser" :user="currentSelectedUser" /> -->
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Plus } from '@element-plus/icons-vue'
import { useFriendStore } from '../store/useFriendStore';
import { storeToRefs } from 'pinia';
import { UserInfo } from '../types/Types';

const UserProfile = defineAsyncComponent(() => import('./friend/UserProfile.vue'))
const FriendApply = defineAsyncComponent(() => import('./friend/FriendApply.vue'))

const searchText = ref<string>('')

const friendStore = useFriendStore()
const { friends } = storeToRefs(friendStore)

const currentSelectedUser = ref<UserInfo>()

const isSelected = computed(() => (user: UserInfo) => currentSelectedUser.value === user)

const selectedHandle = (user: UserInfo) => {
  currentSelectedUser.value = user
  opendComponent.value = UserProfile;
  componentProps.value = {
    user
  }
}

const opendComponent = shallowRef<any>(null)
const componentProps = ref<any>(null)

const openFriendApply = () => {
  opendComponent.value = FriendApply;
  componentProps.value = null;
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
