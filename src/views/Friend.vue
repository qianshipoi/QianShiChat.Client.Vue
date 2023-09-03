<template>
  <div class="friend">
    <div class="sessions">
      <div class="search">
        <el-input v-model="searchText" style="background-color: var(--input-bg-color);" size="small"
          placeholder="搜索"></el-input>
        <button style="padding: 8px; font-weight: 600; background-color: var(--input-bg-color); border-radius: 4px;">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
      </div>

      <ul class="options">
        <li @click="openFriendApply">
          <span>好友通知</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </li>
        <li>
          <span>群通知</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </li>
      </ul>

      <ul>
        <li v-for="friend in friends" :key="friend.id">
          <UserItem :model-value="friend" @selected="selectedHandle" :is-selected="isSelected(friend)" />
        </li>
      </ul>
    </div>
    <div class="content">
      <component v-if="opendComponent" v-bind="componentProps" :is="opendComponent" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Plus, ArrowRight } from '@element-plus/icons-vue'
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
  currentSelectedUser.value = undefined;
}

</script>

<style lang="scss" scoped>
.friend {
  display: flex;
  height: 100%;
}

.sessions {
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

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &>li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
      background-color: var(--primary);
    }
  }
}
</style>
