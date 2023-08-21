<template>
  <div class="message">
    <div class="sessions">
      <ul>
        <li v-for="session in sessions" :key="session.id">
          <SessionItem :model-value="session" @selected="selectedHandle" :is-selected="isSelected(session)" />
        </li>
      </ul>
    </div>
    <div class="content"></div>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useSessionStore } from '../store/useSessionStore';
import { Session } from '../types/Types';

const sessionStore = useSessionStore();
const { sessions, } = storeToRefs(sessionStore);

onMounted(async () => {
  await sessionStore.loadSesions();
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

.content {
  flex: 1;
  background-color: #F2F2F2;
  height: 100%;
}
</style>
