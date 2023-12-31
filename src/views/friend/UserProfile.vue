<template>
  <div class="user-profile" v-if="value">
    <div class="base-info">
      <el-image :src="value.avatar" fit="cover" style="width: 100px; height: 100px; border-radius: 50%;" />
      <div class="info">
        <span class="nickname">{{ value.nickName }}</span>
        <span class="uid">UID: {{ value.id }}</span>
      </div>
      <div class="actions">
        <el-icon @click="sendMessage">
          <Message />
        </el-icon>
      </div>
    </div>
    <div class="editable">

    </div>
  </div>
</template>

<script setup lang='ts'>
import { ElNotification } from 'element-plus';
import { useChatStore } from '../../store/useChatStore';
import { useRoomStore } from '../../store/useRoomStore';
import { ChatMessageSendType, UserInfo } from '../../types/Types';
import { Message } from '@element-plus/icons-vue'
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { useRouter } from 'vue-router';

export type UserProfileProps = {
  user: UserInfo
}

const props = defineProps<UserProfileProps>()

const chatStore = useChatStore()
const roomsStore = useRoomStore()
const currentUserStore = useCurrentUserStore()
const router = useRouter()
const value = ref<UserInfo | null>(props.user)


const sendMessage = async () => {
  const room = await chatStore.getRoom(value.value!.id, ChatMessageSendType.Personal)
  if (!room) {
    ElNotification.error('get room error.')
    return
  }
  room.toObject = value.value!;
  room.fromUser = currentUserStore.userInfo
  room.name = value.value!.nickName ?? ""
  room.avatar = value.value!.avatar
  roomsStore.addRoom(room);
  roomsStore.openRoom(room.id);

  // join to message room.
  router.push({
    name: "Message"
  })
}

</script>

<style lang="scss" scoped>
.user-profile {
  padding: 96px;
}

.base-info {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.info>.nickname {
  font-weight: 600;
  font-size: 1.2rem;
}

.info>.uid {
  font-size: 0.8rem;
  color: #999999;
}

.actions {
  display: flex;
}

.actions .el-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: white;
  font-size: 1.4rem;
  background-color: var(--primary);
  cursor: pointer;
}
</style>
