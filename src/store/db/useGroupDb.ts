import { Group } from "../../types/Types"
import { useChatStore } from "../useChatStore"

export const useGroupDb = () => {
  const chatStore = useChatStore()

  const addOrUpdate = (group: Group) => {
    return chatStore.chatDatabase?.groups.put({
      id: group.id,
      userId: group.userId,
      name: group.name,
      avatar: group.avatar,
      totalUser: group.totalUser,
      createTime: group.createTime,
    }, group.id)
  }

  const del = (groupId: number) => {
    return chatStore.chatDatabase?.groups.delete(groupId)
  }

  const getAll = async () => {
    return await chatStore.chatDatabase?.groups.toArray()
  }

  const get = async (groupId: number) => {
    return await chatStore.chatDatabase?.groups.get(groupId)
  }

  return {
    addOrUpdate,
    del,
    getAll,
    get
  }
}
