import { UserInfo } from "../../types/Types"
import { useChatStore } from "../useChatStore"

export const useFriendDb = () => {
  const chatStore = useChatStore()

  const addOrUpdate = (user: UserInfo) => {
    return chatStore.chatDatabase?.friends.put({
      id: user.id,
      account: user.account,
      nickName: user.nickName,
      avatar: user.avatar,
      createTime: user.createTime,
    }, user.id)
  }

  const del = (userId: number) => {
    return chatStore.chatDatabase?.friends.delete(userId)
  }

  const getAll = async () => {
    return await chatStore.chatDatabase?.friends.toArray()
  }

  return {
    addOrUpdate,
    del,
    getAll
  }
}
