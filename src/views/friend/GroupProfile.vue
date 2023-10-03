<template>
  <div class="group-profile" v-if="value">
    <div class="base-info">
      <el-image :src="value.avatar" fit="cover"
        style="width: 100px;height: 100px;border-radius: 50%;overflow: hidden;"></el-image>
      <div class="info">
        <span class="nickname">{{ value.name }}</span>
        <span class="uid">ID: {{ value.id }}</span>
      </div>
      <div class="actions">
        <el-icon @click="sendMessage">
          <Message />
        </el-icon>
      </div>
    </div>

    <div class="editable">

    </div>

    <span>menber: {{ value.totalUser }}</span>
    <div class="member" v-if="value.users && value.users.length > 0">
      <el-image v-for="user in value.users" :src="user.avatar" fit="cover"
        style="width: 34px;height: 34px; border-radius: 50%; overflow: hidden;"></el-image>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '../../store/useChatStore';
import { useCurrentUserStore } from '../../store/useCurrentUserStore';
import { useRoomStore } from '../../store/useRoomStore';
import { ChatMessageSendType, Group } from '../../types/Types';
import { Message } from '@element-plus/icons-vue'
import { useGroupStore } from '../../store/useGroupStore';

const chatStore = useChatStore()
const roomsStore = useRoomStore()
const currentUserStore = useCurrentUserStore()
const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore();

const value = ref<Group | null>(null)
  ; (async () => {
    value.value = await groupStore.getGroup(Number.parseInt(route.params.id as string))
  })();

watch(() => value.value, (newVal: Group | null) => {
  if (newVal && (!newVal.users || newVal.users.length === 0)) {
    groupStore.loadMembers(newVal.id)
  }
})

const sendMessage = async () => {
  const room = await chatStore.getRoom(value.value!.id, ChatMessageSendType.Group)
  if (!room) {
    ElNotification.error('get room error.')
    return
  }
  room.toObject = value.value!;
  room.fromUser = currentUserStore.userInfo
  room.name = value.value!.name ?? ""
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
.group-profile {
  padding: 96px;
}

.base-info {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;

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
}

.member {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
