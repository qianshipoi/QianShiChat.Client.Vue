import { defineStore } from "pinia";
import { ChatMessageSendType, NotificationMessage, NotificationType, Session, UserInfo } from "../types/Types";
import { useSessionStorage } from "@vueuse/core";
import { useChatStore } from "./useChatStore";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { useUserStore } from "./useUserStore";
import emitter from "../utils/mitt";

export const useSessionStore = defineStore("session", () => {
  const sessions = useSessionStorage<Session[]>("sessions", [])

  const opendRoom = ref<Session | null>(null)

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

  chatStore.onNotification((notification: NotificationMessage) => {
    if (notification.type === NotificationType.FriendOffline || notification.type === NotificationType.FriendOnline) {
      const userId = notification.message as number;
      const room = sessions.value.find(x => x.toId === userId && x.type === ChatMessageSendType.Personal);
      if (room) {
        (room.toObject as UserInfo).isOnline = notification.type === NotificationType.FriendOnline;
        emitter.emit("online-change", { id: userId, status: notification.type === NotificationType.FriendOnline })
      }
    }
  })

  const addSession = (session: Session) => {
    moveSessionTop(session);
  }

  const removeSession = (session: Session) => {
    const index = sessions.value.findIndex(s => s.id === session.id);
    if (index !== -1) {
      sessions.value.splice(index, 1);
    }
  }

  watch(() => chatStore.isReady, (isReady: boolean) => {
    if (isReady) {
      chatStore.subscribeSessions({
        next: async (item) => {
          const user = await userStore.getUser(item.toId)
          item.fromUser = currentUserStore.userInfo
          item.avatar = user.avatar
          item.name = user.nickName ?? user.account
          item.toObject = user;
          addSession(item)
        }
      })
      chatStore.sendSteam()
    }
  })

  const clearUnreadCount = (sessionId: string) => {
    const session = sessions.value.find(x => x.id === sessionId)
    session && (session.unreadCount = 0)
  }

  const getSession = (id: string) => {
    return sessions.value.find(x => x.id === id)
  }

  const openRoom = (roomId: string) => {
    const room = sessions.value.find(x => x.id === roomId)
    room && (opendRoom.value = room)
  }

  return {
    sessions: readonly(sessions),
    addSession,
    removeSession,
    clearUnreadCount,
    getSession,
    opendRoom: readonly(opendRoom),
    isOpendRoom: computed(() => !!opendRoom.value),
    opendRoomRaw: opendRoom,
    isOpend: computed(() => (roomId: string) => (!!opendRoom.value && opendRoom.value.id === roomId)),
    openRoom
  }
})
