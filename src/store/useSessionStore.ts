import { defineStore } from "pinia";
import { ChatMessageSendType, Session } from "../types/Types";
import { useSessionStorage } from "@vueuse/core";
import { getFriends } from "../api/friend";
import { ElMessage } from "element-plus";
import { useChatStore } from "./useChatStore";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { useUserStore } from "./useUserStore";
import { el } from "element-plus/es/locale";

export const useSessionStore = defineStore('session', () => {
  const sessions = useSessionStorage<Session[]>('sessions', [])

  const currentUserStore = useCurrentUserStore()
  const userStore = useUserStore();

  const chatStore = useChatStore();

  function moveSessionTop(session: Session) {
    const index = sessions.value.findIndex(s => s.id === session.id);
    if (index === -1) {
      sessions.value.unshift(session)
    } else if (index === 0) {
      const oldSession = sessions.value[index];
      oldSession.avatar = session.avatar
      oldSession.unreadCount = session.unreadCount
      oldSession.lastContent = session.lastContent
      oldSession.lastMessageTime = session.lastMessageTime
      oldSession.name = session.name
    } else {
      const oldSession = sessions.value.splice(index, 1)[0];
      oldSession.avatar = session.avatar
      oldSession.unreadCount = session.unreadCount
      oldSession.lastContent = session.lastContent
      oldSession.lastMessageTime = session.lastMessageTime
      oldSession.name = session.name
      sessions.value.unshift(oldSession);
    }
  }

  chatStore.onPrivateChat(async message => {
    let session = sessions.value.find(s => s.id === message.sessionId)
    if (!session) {
      const user = await userStore.getUser(message.fromId)
      session = {
        id: getSessionId(message.fromId),
        toId: message.fromId,
        type: message.sendType,
        unreadCount: 99,
        avatar: user.avatar,
        name: user.nickName!,
        lastMessageTime: new Date().getTime(),
      }
    }
    moveSessionTop(session)
  });

  const addSession = (session: Session) => {
    moveSessionTop(session);
  }

  const removeSession = (session: Session) => {
    const index = sessions.value.findIndex(s => s.id === session.id);
    if (index !== -1) {
      sessions.value.splice(index, 1);
    }
  }

  function getSessionId(userId: number): string {
    const currentUserId = currentUserStore.userInfo?.id!
    if (currentUserId > userId) {
      return `${userId}-${currentUserId}`
    } else {
      return `${currentUserId}-${userId}`
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
        id: getSessionId(user.id),
        toId: user.id,
        type: ChatMessageSendType.Personal,
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
