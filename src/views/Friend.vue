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
        <li @click="contactsStore.openFriendApply">
          <span>好友通知</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </li>
        <li @click="contactsStore.openGroupApply">
          <span>群通知</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </li>
      </ul>

      <QsTabs default-active-key="1">
        <QsTabPanel key="1" label="好友">
          <button>管理分组</button>
          <el-collapse :accordion="false">
            <el-collapse-item v-for="group in friendStore.friendGroups" :key="group.id" style="overflow: auto;"
              :name="group.id">
              <template #title>
                <div style="padding-left: 10px; display: flex; justify-content: space-between; align-items: center;">
                  <span>{{ group.name }}</span>
                  <span>&nbsp;({{ group.friends.length }})</span>
                </div>
              </template>
              <ul>
                <li v-for="friend in group.friends" :key="friend.id">
                  <UserItem :model-value="friend" @selected="contactsStore.openUserProfile(friend)"
                    :is-selected="contactsStore.selected === friend" />
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>

        </QsTabPanel>
        <QsTabPanel key="2" label="群组">
          <ul>
            <li v-for="group in groupStore.groups" :key="group.id">
              <GroupItem :model-value="(group as Group)" @selected="contactsStore.openGroupProfile(group as Group)"
                :is-selected="contactsStore.selected === group" />
            </li>
          </ul>
        </QsTabPanel>
      </QsTabs>
    </div>
    <div class="content">
      <component :is="contactsStore.opendComponent" v-bind="contactsStore.opendComponentProps"
        v-if="contactsStore.opendComponentVisible" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Plus, ArrowRight } from '@element-plus/icons-vue'
import { useFriendStore } from '../store/useFriendStore';
import { Group } from '../types/Types';
import { useGroupStore } from '../store/useGroupStore';
import { useContactsStore } from '../store/useContactsStore';

const searchText = ref<string>('')
const friendStore = useFriendStore()
const groupStore = useGroupStore()
const contactsStore = useContactsStore()
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



:deep(.el-collapse-item .el-collapse-item__content) {
  padding-bottom: 0 !important;
}
</style>
