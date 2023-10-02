import { Room } from "../../types/Types"
import { useChatStore } from "../useChatStore"

export const useRoomDb = () => {
  const chatStore = useChatStore()

  const addOrUpdate = (room: Room) => {
    return chatStore.chatDatabase?.rooms.put({
      id: room.id,
      toId: room.toId,
      type: room.type,
      unreadCount: room.unreadCount,
      avatar: room.avatar,
      name: room.name,
      lastMessageTime: room.lastMessageTime,
      lastMessageContent: typeof room.lastMessageContent === 'string' ? room.lastMessageContent : room.lastMessageContent?.name,
    }, room.id)
  }

  const del = (roomId: string) => {
    return chatStore.chatDatabase?.rooms.delete(roomId)
  }

  const getAll = async () => {
    return await chatStore.chatDatabase?.rooms.toArray()
  }

  return {
    addOrUpdate,
    del,
    getAll
  }
}
