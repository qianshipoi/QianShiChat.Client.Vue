<template>
  <el-dialog v-model="visible" width="300px" :close-on-click-modal="false" destroy-on-close
    :close-on-press-escape="false">
    <div class="create-group">
      <el-input v-model="searchText" placeholder="搜索" clearable @change="serachHandle"></el-input>
      <ul class="friend-list">
        <li class="friend-item" v-for="friend in results" :key="friend.id" @click="friend.selected = !friend.selected">
          <el-checkbox v-model="friend.selected" :indeterminate="false"></el-checkbox>
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
import { create } from '../../api/group';
import { ElNotification } from 'element-plus';

const friendStore = useFriendStore()
const visible = defineModel<boolean>()
const searchText = ref("");
const serachHandle = () => {
}

interface SelectableUserInfo extends UserInfo {
  selected: boolean
}

const friends = reactive<SelectableUserInfo[]>([])

watch(() => friendStore.friends, () => {
  friendStore.friends.map(friend => {
    friends.push({ ...friend, selected: false })
  })
}, {
  immediate: true
})

const results = useArrayFilter(friends, friend => friend.nickName?.includes(searchText.value) ?? false)

const loading = ref(false);

const canSubmit = computed(() => !loading.value && friends.findIndex(x => x.selected) !== -1)

const submitHandle = async () => {
  loading.value = true;
  try {
    const { succeeded, errors } = await create(friends.filter(x => x.selected).map(item => item.id));
    if (!succeeded) {
      throw new Error(errors as string);
    }
    ElNotification.success('create succeeded.')
    visible.value = false;
  } catch (error: any) {
    ElNotification.error(error)
  } finally {
    loading.value = false
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

    &:hover {
      background-color: var(--primary);
      color: white;
    }
  }
}
</style>
