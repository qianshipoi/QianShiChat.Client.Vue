import { defineStore } from "pinia";
import { Session, SessionType } from "../types/Types";
import { useLocalStorage } from "@vueuse/core";
import { getFriends } from "../api/friend";
import { ElMessage } from "element-plus";

export const useSessionStore = defineStore('session', () => {
  const sessions = useLocalStorage<Session[]>('sessions', [])

  const addSession = (session: Session) => {
    const index = sessions.value.findIndex(s => s.id === session.id);
    if (index !== -1) {
      const oldSession = sessions.value.splice(index, 1)
      session = oldSession[0]
    }
    session.avatar = session.avatar;
    session.lastContent = session.lastContent;
    session.lastMessageTime = session.lastMessageTime;
    session.name = session.name;
    session.unreadCount = session.unreadCount;
    sessions.value.unshift(session)
  }

  const removeSession = (session: Session) => {
    const index = sessions.value.findIndex(s => s.id === session.id);
    if (index !== -1) {
      sessions.value.splice(index, 1);
    }
  }

  const loadSesions = async () => {
    const result = await getFriends()
    if (!result.succeeded) {
      ElMessage.error(result.errors)
      return
    }

    result.data!.forEach(user => {
      addSession({
        id: user.id,
        type: SessionType.Personal,
        unreadCount: 99,
        avatar: user.avatar,
        name: user.nickName!,
        lastMessageTime: new Date().getTime(),
      })
    });
  }

  return {
    sessions: computed(() => readonly(sessions.value)),
    addSession,
    removeSession,
    loadSesions
  }
})
