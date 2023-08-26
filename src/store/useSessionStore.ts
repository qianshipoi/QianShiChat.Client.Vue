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

  chatStore.onPrivateChat(async message => {
    let session = sessions.value.find(s => s.id === message.sessionId)
    if (!session) {
      const user = await userStore.getUser(message.fromId)
      session = {
        id: message.sessionId,
        toId: message.fromId,
        type: message.sendType,
        unreadCount: 1,
        avatar: user.avatar,
        name: user.nickName!,
        lastMessageTime: message.createTime,
        lastMessageContent: message.content,
        toObject: user,
        fromUser: currentUserStore.userInfo,
        from: user
      }
    } else {
      session.unreadCount++;
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

  const clearUnreadCount = (sessionId: string) => {
    const session = sessions.value.find(x => x.id === sessionId)
    session && (session.unreadCount = 0)
  }

  return {
    sessions: computed(() => readonly(sessions.value)),
    addSession,
    removeSession,
    clearUnreadCount
  }
})
