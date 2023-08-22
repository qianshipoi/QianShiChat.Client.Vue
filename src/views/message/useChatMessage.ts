import { history } from "../../api/chat"
import { useUserStore } from "../../store/useUserStore"
import { ChatMessage } from "../../types/Types"
import { ElMessage } from "element-plus"

type RoomMessages = {
  id: number
  messages: ChatMessage[]
}

export const useChatMessage = () => {
  const roomMessages = reactive<RoomMessages[]>([])

  const userStore = useUserStore()

  const getRoomMessage = (id: number) => {

    const loading = ref<boolean>(false)
    let roomMessage = roomMessages.find(x => x.id === id)
    if (!roomMessage) {
      roomMessage = {
        id: id,
        messages: reactive([])
      }
      roomMessages.push(roomMessage)
    }

    const loadData = async () => {
      try {
        loading.value = true
        const paged = await history(id, 1)
        if (paged.data?.items) {
          paged.data?.items.forEach(async item => {
            item.fromUser = await userStore.getUser(item.fromId)
            roomMessage?.messages.push(item)
          })
        }
      } catch (err) {
        ElMessage.error(err as string)
      } finally {
        loading.value = false
      }
    }

    return {
      loading: computed(() => loading.value),
      messages: readonly(roomMessage.messages),
      loadData
    }
  }


  return {
    getRoomMessage
  }
}
