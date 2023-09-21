<template>
  <div class="friend">
    <div class="friend-list">
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
        <li @click="openGroupApply">
          <span>群通知</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </li>
      </ul>
      <QsTabs default-active-key="2">
        <QsTabPanel key="1" label="好友">
          <ul>
            <li v-for="friend in friends" :key="friend.id">
              <UserItem :model-value="friend" @selected="selectedHandle" :is-selected="isSelected(friend)" />
            </li>
          </ul>
        </QsTabPanel>
        <QsTabPanel key="2" label="群组">
          <ul>
            <li v-for="group in groupStore.groups" :key="group.id">
              <GroupItem v-model="(group as Group)" @selected="selectedHandle(group as Group, false)"
                :is-selected="isSelected(group as Group)" />
            </li>
          </ul>
        </QsTabPanel>
      </QsTabs>
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
import { Group, UserInfo } from '../types/Types';
import { useGroupStore } from '../store/useGroupStore';

const UserProfile = defineAsyncComponent(() => import('./friend/UserProfile.vue'))
const GroupProfile = defineAsyncComponent(() => import('./friend/GroupProfile.vue'))
const FriendApply = defineAsyncComponent(() => import('./friend/FriendApply.vue'))
const GroupApply = defineAsyncComponent(() => import('./friend/GroupApply.vue'))

const searchText = ref<string>('')
const opendComponent = shallowRef<any>(null)
const currentSelected = ref<UserInfo | Group>()
const componentProps = ref<any>(null)
const friendStore = useFriendStore()
const { friends } = storeToRefs(friendStore)
const groupStore = useGroupStore()

const isSelected = computed(() => (item: UserInfo | Group) => currentSelected.value === item)

const selectedHandle = (item: UserInfo | Group, isUser: boolean = true) => {
  currentSelected.value = item
  opendComponent.value = isUser ? UserProfile : GroupProfile;
  componentProps.value = { value: item }
}

const openFriendApply = () => {
  opendComponent.value = FriendApply;
  componentProps.value = null;
  currentSelected.value = undefined;
}

const openGroupApply = () => {
  opendComponent.value = GroupApply;
  componentProps.value = null;
  currentSelected.value = undefined;
}

</script>

<style lang="scss" scoped>
.friend {
  display: flex;
  height: 100%;
}

.friend-list {
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
