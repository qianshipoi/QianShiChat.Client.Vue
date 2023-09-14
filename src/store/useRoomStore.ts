import { defineStore } from "pinia";
import { ChatMessageSendType, NotificationMessage, NotificationType, Room, UserInfo } from "../types/Types";
import { useSessionStorage } from "@vueuse/core";
import { useChatStore } from "./useChatStore";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { useUserStore } from "./useUserStore";
import emitter from "../utils/mitt";

export const useRoomStore = defineStore("room_store", () => {
  const rooms = useSessionStorage<Room[]>("rooms", [])

  const opendRoom = ref<Room | null>(null)

  const currentUserStore = useCurrentUserStore()
  const userStore = useUserStore();
  const chatStore = useChatStore();

  function moveRoomTop(room: Room) {
    const index = rooms.value.findIndex(s => s.id === room.id);
    if (index === -1) {
      rooms.value.unshift(room)
    } else if (index === 0) {
      const oldRoom = rooms.value[index];
      oldRoom.avatar = room.avatar
      oldRoom.unreadCount = room.unreadCount
      oldRoom.lastMessageContent = room.lastMessageContent
      oldRoom.lastMessageTime = room.lastMessageTime
      oldRoom.name = room.name
    } else {
      const oldRoom = rooms.value.splice(index, 1)[0];
      oldRoom.avatar = room.avatar
      oldRoom.unreadCount = room.unreadCount
      oldRoom.lastMessageContent = room.lastMessageContent
      oldRoom.lastMessageTime = room.lastMessageTime
      oldRoom.name = room.name
      rooms.value.unshift(oldRoom);
    }
  }

  chatStore.onPrivateChat(async message => {
    let room = rooms.value.find(s => s.id === message.roomId)
    if (!room) {
      const user = await userStore.getUser(message.fromId)
      room = {
        id: message.roomId,
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
      room.unreadCount++;
    }
    moveRoomTop(room)
  });

  chatStore.onNotification((notification: NotificationMessage) => {
    if (notification.type === NotificationType.FriendOffline || notification.type === NotificationType.FriendOnline) {
      const userId = notification.message as number;
      const room = rooms.value.find(x => x.toId === userId && x.type === ChatMessageSendType.Personal);
      if (room) {
        (room.toObject as UserInfo).isOnline = notification.type === NotificationType.FriendOnline;
        emitter.emit("online-change", { id: userId, status: notification.type === NotificationType.FriendOnline })
      }
    }
  })

  const addRoom = (room: Room) => {
    moveRoomTop(room);
  }

  const removeRoom = (room: Room) => {
    const index = rooms.value.findIndex(s => s.id === room.id);
    if (index !== -1) {
      rooms.value.splice(index, 1);
    }
  }

  watch(() => chatStore.isReady, (isReady: boolean) => {
    if (isReady) {
      chatStore.subscribeRooms({
        next: async (item) => {
          const user = await userStore.getUser(item.toId)
          item.fromUser = currentUserStore.userInfo
          item.avatar = user.avatar
          item.name = user.nickName ?? user.account
          item.toObject = user;
          addRoom(item)
        }
      })
    }
  })

  const clearUnreadCount = (roomId: string) => {
    const room = rooms.value.find(x => x.id === roomId)
    room && (room.unreadCount = 0)
  }

  const getRoom = (id: string) => {
    return rooms.value.find(x => x.id === id)
  }

  const openRoom = (roomId: string) => {
    const room = rooms.value.find(x => x.id === roomId)
    room && (opendRoom.value = room)
  }

  return {
    rooms: readonly(rooms),
    addRoom,
    removeRoom,
    clearUnreadCount,
    getRoom,
    opendRoom: readonly(opendRoom),
    isOpendRoom: computed(() => !!opendRoom.value),
    opendRoomRaw: opendRoom,
    isOpend: computed(() => (roomId: string) => (!!opendRoom.value && opendRoom.value.id === roomId)),
    openRoom
  }
})