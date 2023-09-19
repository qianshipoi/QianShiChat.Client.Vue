<template>
  <el-dialog v-model="visible" width="400px" draggable :close-on-press-escape="false" :close-on-click-modal="false">
    <div class="add-friend-search">
      <div class="search">
        <el-input v-model="searchText" clearable @keydown.enter="throttledSearch">
          <template #prepend>
            <el-button :icon="Search" />
          </template>
          <template #append>
            <el-button @click="throttledSearch">搜索</el-button>
          </template>
        </el-input>

        <div class="result">
          <div class="title" v-if="displayUserResult">
            <span>查找人</span>
            <el-link type="primary" :underline="false" href="javascript:;">更多</el-link>
          </div>

          <ul class="list" v-if="displayUserResult">
            <li class="list-item" v-for="user in userResult" :key="user.id">
              <user-base :user="user" use-highlight :highlight-text="searchText"></user-base>
              <button v-if="user.relation === UserRelation.None" @click="selectedUser = user">添加</button>
              <button v-else-if="user.relation === UserRelation.Friend" @click="sendMessage('user', user)">发消息</button>
              <button v-else disabled>已申请</button>
            </li>
          </ul>

          <div class="title" v-if="displayGroupResult">
            <span>查找组</span>
            <el-link type="primary" :underline="false" href="javascript:;">更多</el-link>
          </div>

          <ul class="list" v-if="displayGroupResult">
            <li class="list-item" v-for="group in groupResult" :key="group.id">
              <group-base :group="group" use-highlight :highlight-text="searchText"></group-base>
              <button v-if="group.relation === UserRelation.None" @click="selectedGroup = group">添加</button>
              <button v-else-if="group.relation === UserRelation.Joined" @click="sendMessage('group', group)">发消息</button>
              <button v-else disabled>已申请</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="apply" v-if="selectedUser" v-loading="loading">
        <user-base :user="selectedUser"></user-base>
        <el-input type="textarea" :maxlenght="255" show-word-limit resize="none" :rows="4"
          v-model="applyRemark"></el-input>
        <div class="action">
          <button class="primary" @click="apply(selectedUser)" type="button"
            :disabled="!(applyRemark && applyRemark.length > 0)">
            申请</button>
          <button @click="selectedUser = null; applyRemark = ''">返回</button>
        </div>
      </div>
      <div class="apply" v-if="selectedGroup" v-loading="loading">
        <group-base :group="selectedGroup"></group-base>
        <el-input type="textarea" :maxlenght="255" show-word-limit resize="none" :rows="4"
          v-model="applyRemark"></el-input>
        <div class="action">
          <button class="primary" @click="applyGroup(selectedGroup)" type="button"
            :disabled="!(applyRemark && applyRemark.length > 0)">
            申请</button>
          <button @click="selectedGroup = null; applyRemark = ''">返回</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'
import { UserInfo, Group, ChatMessageSendType } from '../types/Types';
import { friendApply, search as searchApi } from '../api/user'
import { ElNotification } from 'element-plus';
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { useThrottleFn } from '@vueuse/core';
import { useFriendStore } from '../store/useFriendStore';
import { search as groupSearchApi, join } from '../api/group'
import { useGroupStore } from '../store/useGroupStore'
import { useChatStore } from '../store/useChatStore';
import { useRoomStore } from '../store/useRoomStore';
import { useCurrentUserStore } from '../store/useCurrentUserStore';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const visible = defineModel<boolean>()
const searchText = ref<string>('')

const userResult = ref<UserResult[]>([]);
const groupResult = ref<GroupResult[]>([])
const loading = ref<boolean>(false);

const selectedUser = ref<UserResult | null>(null)
const selectedGroup = ref<GroupResult | null>(null)

let cancelTokenSource: CancelTokenSource;

const throttledSearch = useThrottleFn(() => search(), 1000)

const friendStore = useFriendStore()
const groupStore = useGroupStore()

enum UserRelation {
  None,
  Friend,
  Joined,
  Applied
}

interface GroupResult extends Group {
  relation: UserRelation
}

interface UserResult extends UserInfo {
  relation: UserRelation;
}

const search = async () => {
  cancelTokenSource?.cancel();
  if (!searchText.value) {
    userResult.value = []
    return;
  }
  loading.value = true;
  try {
    cancelTokenSource = axios.CancelToken.source()
    await Promise.all([searchUser(cancelTokenSource.token), searchGroup(cancelTokenSource.token)])
  } catch (err: any) {
    ElNotification.error(err)
  } finally {
    loading.value = false;
  }
}

const searchUser = async (cancelToken: CancelToken) => {
  const result = await searchApi(searchText.value, 1, 5, cancelToken);
  if (!result.succeeded) {
    throw new Error(result.errors as string)
  }

  const data: UserResult[] = []
  result.data!.items.forEach((user: UserInfo) => {
    data.push(reactive({
      ...user,
      relation: friendStore.isFriend(user.id) ? UserRelation.Friend : UserRelation.None
    }))
  });

  userResult.value = data
}

const searchGroup = async (cancelToken: CancelToken) => {
  const { succeeded, data, errors } = await groupSearchApi({
    page: 1,
    size: 5,
    search: searchText.value,
  }, cancelToken)
  if (!succeeded) {
    ElNotification.error(errors as string)
    return;
  }
  const items: GroupResult[] = []
  data!.items.forEach((group: Group) => {
    items.push(reactive({
      ...group,
      relation: groupStore.joinedGroup(group.id) ? UserRelation.Joined : UserRelation.None
    }))
  });
  groupResult.value = items
}

const displayUserResult = computed(() => userResult.value && userResult.value.length > 0)

const displayGroupResult = computed(() => groupResult.value && groupResult.value.length > 0)

const applyRemark = ref<string>('')
const apply = async (user: UserResult) => {
  loading.value = true
  try {
    const result = await friendApply(user.id, applyRemark.value);
    if (!result.succeeded) {
      throw new Error(result.errors as string)
    }
    ElNotification.success('已发送申请')
    selectedUser.value = null;
    applyRemark.value = ''
    user.relation = UserRelation.Applied
  } catch (error: any) {
    ElNotification.error(error);
  } finally {
    loading.value = false
  }
}

const applyGroup = async (group: GroupResult) => {
  loading.value = true
  try {
    const result = await join(group.id, applyRemark.value);
    if (!result.succeeded) {
      throw new Error(result.errors as string)
    }
    ElNotification.success('已发送申请')
    selectedUser.value = null;
    applyRemark.value = ''
    group.relation = UserRelation.Applied
  } catch (error: any) {
    ElNotification.error(error);
  } finally {
    loading.value = false
  }
}

interface GroupParams {
  type: 'group',
  value: GroupResult
}

interface UserParams {
  type: 'user',
  value: UserResult
}
type Params = GroupParams | UserParams

const chatStore = useChatStore()

const roomsStore = useRoomStore()
const currentUserStore = useCurrentUserStore()
const route = useRoute();
const router = useRouter()


async function sendMessage<TType extends Params['type']>(
  type: TType,
  value: Extract<Params, { type: TType }>['value']
): Promise<void> {
  const room = await chatStore.getRoom(value.id, type === 'user' ? ChatMessageSendType.Personal : ChatMessageSendType.Group)
  if (!room) {
    ElNotification.error('get room error.')
    return
  }
  room.toObject = value;
  room.fromUser = currentUserStore.userInfo
  roomsStore.addRoom(room);
  roomsStore.openRoom(room.id);

  // join to message room.
  route.name !== 'Message' && router.push({ name: "Message" })
}

</script>

<style lang="scss" scoped>
.add-friend-search {
  min-height: 500px;
  position: relative;
}

.search {

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list-item {
    height: 50px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    align-items: center;
  }

  .list-item>button {
    width: 60px;
    height: 24px;
    font-size: 12px;
    padding: 0;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
  }
}

.apply {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;

  .action {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 8px;
  }

  .primary {
    background-color: var(--primary);
    color: white;

    &:disabled {
      opacity: .8;
      filter: opacity(80);
      cursor: not-allowed;
    }
  }
}
</style>
