<template>
  <div class="message">
    <div class="sessions">
      <div class="search">
        <el-input v-model="searchText" size="small" placeholder="搜索"></el-input>
        <button style="padding: 8px; font-weight: 600;">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
      </div>
      <ul>
        <li v-for="session in sessions" :key="session.id">
          <SessionItem :model-value="session" @selected="selectedHandle" :is-selected="isSelected(session)" />
        </li>
      </ul>
    </div>
    <div class="content">
      <room v-if="currentSelectedSession" :session="currentSelectedSession"></room>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useSessionStore } from '../store/useSessionStore';
import { Session } from '../types/Types';
import Room from './message/Room.vue'
import { Plus } from '@element-plus/icons-vue'

const sessionStore = useSessionStore();
const { sessions, } = storeToRefs(sessionStore);
const searchText = ref<string>('')
onMounted(() => {
  sessionStore.loadSesions();
})

const currentSelectedSession = ref<Session>()

const isSelected = computed(() => (session: Session) => currentSelectedSession.value === session)

const selectedHandle = (session: Session) => {
  currentSelectedSession.value = session
}

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
