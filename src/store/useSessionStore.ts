import { defineStore } from "pinia";
import { ChatMessageSendType, Session } from "../types/Types";
import { useSessionStorage } from "@vueuse/core";
import { useChatStore } from "./useChatStore";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { useUserStore } from "./useUserStore";

export const useSessionStore = defineStore("session", () => {
  const sessions = useSessionStorage<Session[]>("sessions", [])

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
      oldSession.lastMessageContent = session.lastMessageContent
      oldSession.lastMessageTime = session.lastMessageTime
      oldSession.name = session.name
    } else {
      const oldSession = sessions.value.splice(index, 1)[0];
      oldSession.avatar = session.avatar
      oldSession.unreadCount = session.unreadCount
      oldSession.lastMessageContent = session.lastMessageContent
      oldSession.lastMessageTime = session.lastMessageTime
      oldSession.name = session.name
      sessions.value.unshift(oldSession);
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
        lastMessageContent: message.content,
        from: user
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

  watch(() => chatStore.isReady, async (isReady: boolean) => {
    if (isReady) {
      const data = await chatStore.getSessions();
      const ids: number[] = data.filter(s => s.type === ChatMessageSendType.Personal)
        .map(x => x.toId);
      const users = await userStore.getUsers(ids);
      sessions.value = []
      data.map(item => {
        const user = users.find(x => x.id === item.toId)!
        item.fromUser = currentUserStore.userInfo
        item.avatar = user.avatar
        item.name = user.nickName ?? user.account
        item.toObject = user;
        addSession(item)
      })
    }
  })

  return {
    sessions: computed(() => readonly(sessions.value)),
    addSession,
    removeSession,
  }
})
