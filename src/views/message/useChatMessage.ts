import { history } from "../../api/chat"
import { useChatStore } from "../../store/useChatStore"
import { useSessionStore } from "../../store/useSessionStore"
import { useUserStore } from "../../store/useUserStore"
import { ChatMessage, ChatMessageSendType, Session } from "../../types/Types"
import { ElMessage } from "element-plus"
import { sendText } from '../../api/chat';

type RoomMessages = {
  id: string
  session: Session
  messages: ChatMessage[]
}

export const useChatMessage = () => {
  const roomMessages = reactive<RoomMessages[]>([])

  const userStore = useUserStore()
  const sessionStore = useSessionStore()
  const chatStore = useChatStore()

  const getRoomMessage = (id: string) => {
    const loading = ref<boolean>(false)
    let roomMessage = roomMessages.find(x => x.id === id)
    if (!roomMessage) {
      roomMessage = {
        id: id,
        session: sessionStore.sessions.find(x => x.id === id)!,
        messages: reactive([])
      }
      roomMessages.push(roomMessage)
    }

    chatStore.onPrivateChat(async (message: ChatMessage) => {
      if (message.sessionId === roomMessage?.id) {
        message.fromUser = await userStore.getUser(message.fromId)
        roomMessage?.messages.push(message)
      }
    })

    const loadData = async () => {
      try {
        loading.value = true
        const paged = await history(roomMessage?.session.toId!, 1)
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

    const send = async (content: string): Promise<boolean> => {
      try {
        loading.value = true
        const result = await sendText({
          toId: roomMessage?.session.toId!,
          sendType: ChatMessageSendType.Personal,
          message: content
        })

        if (!result.succeeded) {
          ElMessage.error(result.errors)
          return false
        }
        result.data!.fromUser = await userStore.getUser(result.data!.fromId)
        roomMessage?.messages.push(result.data!)
        return true;
      } catch (err) {
        console.log(err);
        return false
      } finally {
        loading.value = false
      }
    }

    return {
      loading: computed(() => loading.value),
      messages: readonly(roomMessage.messages),
      loadData,
      sendText: send
    }
  }


  return {
    getRoomMessage
  }
}
