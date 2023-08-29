<template>
  <div class="user-profile">
    <div class="base-info">
      <el-image :src="user.avatar" fit="cover" style="width: 100px; height: 100px; border-radius: 50%;" />
      <div class="info">
        <span class="nickname">{{ user.nickName }}</span>
        <span class="uid">UID: {{ user.id }}</span>
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
import { useSessionStore } from '../../store/useSessionStore';
import { ChatMessageSendType, UserInfo } from '../../types/Types';
import { Message } from '@element-plus/icons-vue'
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { useRouter } from 'vue-router';

const props = defineProps<{
  user: UserInfo
}>()

const chatStore = useChatStore()
const sessionsStore = useSessionStore()
const currentUserStore = useCurrentUserStore()
const router = useRouter()

const sendMessage = async () => {
  const room = await chatStore.getRoom(props.user.id, ChatMessageSendType.Personal)
  if (!room) {
    ElNotification.error('get room error.')
    return
  }
  room.toObject = props.user;
  room.fromUser = currentUserStore.userInfo
  room.name = props.user.nickName ?? ""
  room.avatar = props.user.avatar
  sessionsStore.addSession(room);
  sessionsStore.openRoom(room.id);

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

