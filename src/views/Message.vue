<template>
  <div class="message">
    <div class="sessions">
      <div class="search">
        <el-input v-model="searchText" size="small" placeholder="搜索"></el-input>
        <button style="padding: 8px; font-weight: 600;" @click="addFriendVisible = true">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
      </div>
      <ul>
        <li v-for="session in sessions" :key="session.id">
          <SessionItem :model-value="(session as Session)" @selected="selectedHandle"
            :is-selected="openedRoomId === session.id" />
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view :key="openedRoomId"></router-view>
    </div>
    <add-friend-search v-model="addFriendVisible"></add-friend-search>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useSessionStore } from '../store/useSessionStore';
import { Session } from '../types/Types';
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import AddFriendSearch from '../components/AddFriendSearch.vue';

const sessionStore = useSessionStore();
const { sessions } = storeToRefs(sessionStore);
const searchText = ref<string>('')
const route = useRoute()
const router = useRouter()

const openedRoomId = ref<string>("")

watch(() => route.fullPath, () => {
  if (route.name === "Room") {
    openedRoomId.value = route.params["id"] as string
  } else {
    openedRoomId.value = ''
  }
}, {
  immediate: true
})

const selectedHandle = (session: Session) => {
  router.replace({
    name: "Room",
    params: {
      id: session.id
    }
  })
}

const addFriendVisible = ref<boolean>(false)

</script>

<style scoped>
.message {
  display: flex;
  height: 100%;
}

.sessions {
  width: 260px;
  height: 100%;
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
  background-color: #F2F2F2;
  height: 100%;
}
</style>
