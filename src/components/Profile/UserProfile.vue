<template>
  <div class="profile">
    <div class="base">
      <img :src="user?.avatar" alt="user avatar">
      <div class="info">
        <span class="name">{{ user?.nickName }}</span>
        <span class="uid">UID: {{ user?.id }}</span>
      </div>
    </div>

    <div class="user-info">
      <span>状态</span>
      <span>{{ user?.isOnline ? 'online' : 'offline' }}</span>
      <span>备注</span>
      <span>{{ user?.nickName }}</span>
      <span>签名</span>
      <span>description</span>
    </div>

    <div class="actions">
      <button v-if="isFriend" @click="addFriendHandle">添加好友</button>
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { computedAsync, onClickOutside, useCurrentElement } from '@vueuse/core';
import { useFriendStore } from '../../store/useFriendStore';
import { UserInfo } from '../../types/Types';

export type UserProfileProps = {
  user?: UserInfo;
  onClose: () => void;
}

const props = defineProps<UserProfileProps>()
const friendStore = useFriendStore()

const current = useCurrentElement<HTMLElement>();

onClickOutside(current, () => {
  props.onClose()
})

const isFriend = computedAsync(async () => {
  return props.user ? await friendStore.isFriend(props.user.id) : false
})

const addFriendHandle = () => {
  // TODO
}

const sendMessage = () => {
  // TODO
}
</script>

<style lang="scss" scoped>
.profile {
  position: fixed;
  width: 300px;
  padding: 2rem 1rem;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  box-shadow: var(--el-box-shadow);

  &>.base {
    display: flex;
    align-items: center;
    gap: 1rem;

    &>img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }

    &>.info {
      display: flex;
      flex-direction: column;

      &>.name {
        font-size: 1.2rem;
        font-weight: 600;
      }
    }
  }

  &>.user-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;

    &>span {
      display: flex;
      gap: 0.5rem;
    }
  }

  &>.actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;

    &>button {
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all .3s ease;

      &:hover {
        background-color: #66C8B8;
        color: white;
      }
    }
  }

  &:focus {
    outline: none;
  }
}
</style>
