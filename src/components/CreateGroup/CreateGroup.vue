<template>
  <el-dialog v-model="visible" width="300px" :close-on-click-modal="false" destroy-on-close
    :close-on-press-escape="false">
    <div class="create-group">
      <el-input v-model="searchText" placeholder="搜索" clearable @change="serachHandle"></el-input>
      <ul class="friend-list">
        <li :class="['friend-item', { 'selected': friend.selected }]" v-for="friend in results" :key="friend.id"
          @click="friend.selected = !friend.selected">
          <el-checkbox :checked="friend.selected"></el-checkbox>
          <el-image :src="friend.avatar" fit="cover" :lazy="true"
            style="width: 28px; height: 28px; border-radius: 50%; overflow: hidden;"></el-image>
          <span class="name">{{ friend.nickName }}</span>
        </li>
      </ul>

      <div class="actions">
        <el-button type="primary" :disabled="!canSubmit" @click="submitHandle">创建</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useArrayFilter } from '@vueuse/core';
import { useFriendStore } from '../../store/useFriendStore';
import { UserInfo } from '../../types/Types';
import { useGroupStore } from '../../store/useGroupStore';

const friendStore = useFriendStore()
const visible = defineModel<boolean>()
const searchText = ref("");
const serachHandle = () => {
}

interface SelectableUserInfo extends UserInfo {
  selected: boolean
}

const friends = reactive<SelectableUserInfo[]>([])
const groupStore = useGroupStore()

watch(() => friendStore.friends, () => {
  friendStore.friends.map(friend => {
    friends.push({ ...friend, selected: false })
  })
}, {
  immediate: true
})

const results = useArrayFilter(friends, friend => friend.nickName?.includes(searchText.value) ?? false)

const canSubmit = computed(() => !groupStore.loading && friends.findIndex(x => x.selected) !== -1)

const submitHandle = async () => {
  if (groupStore.loading) return;
  if (await groupStore.createGroup(friends.filter(x => x.selected))) {
    visible.value = false
  }
}

</script>

<style lang="scss" scoped>
.create-group {
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-drag: none;
}

.friend-list {
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;

  .friend-item {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 8px;
    align-items: center;
    text-align: left;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all .3s ease;

    &.selected,
    &:hover {
      background-color: var(--primary);
      color: white;
    }
  }
}
</style>
