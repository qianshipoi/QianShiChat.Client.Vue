import { history } from "../../api/chat"
import { useChatStore } from "../../store/useChatStore"
import { useSessionStore } from "../../store/useSessionStore"
import { useUserStore } from "../../store/useUserStore"
import { Attachment, ChatMessage, ChatMessageSendType, ChatMessageStatus, ChatMessageType, Session, UserInfo } from "../../types/Types"
import { ElMessage, ElNotification } from "element-plus"
import { sendText as sendTextApi, sendFile as sendFileApi } from "../../api/chat";
import { useCurrentUserStore } from "../../store/useCurrentUserStore"
import { upload } from "../../api/attachment"

type RoomMessages = {
  id: String,
  session: Session,
  messages: ChatMessage[]
}

type NewMessageCallback = (message: ChatMessage) => void

export const useChatMessage = () => {
  const roomMessages = reactive<RoomMessages[]>([])

  const userStore = useUserStore()
  const sessionStore = useSessionStore()
  const chatStore = useChatStore()
  const currentUserStore = useCurrentUserStore()

  function getNextId(): number {
    return new Date().getTime()
  }

  function fileTypeToMessageType(fileType: string): ChatMessageType {
    if (["image/png", "image/jpeg", "image/gif", "image/x-icon"].includes(fileType)) {
      return ChatMessageType.Image;
    } else if (["video/mpeg4"].includes(fileType)) {
      return ChatMessageType.Video;
    } else {
      return ChatMessageType.OtherFile;
    }
  }

  const getRoomMessage = (id: string) => {
    const loading = ref<boolean>(false)
    let roomMessage = roomMessages.find(x => x.id === id)!
    if (!roomMessage) {
      roomMessage = {
        id: id,
        session: sessionStore.opendRoomRaw!,
        messages: reactive([])
      }
      roomMessages.push(roomMessage)
    }

    const isPersonalSession = (): boolean => roomMessage?.session.type === ChatMessageSendType.Personal;

    const getUser = async (fromId: number): Promise<UserInfo> => {
      if (fromId === currentUserStore.userInfo?.id) {
        return currentUserStore.userInfo;
      }

      if (isPersonalSession()) {
        return roomMessage!.session.toObject as UserInfo
      } else if (roomMessage!.session.type === ChatMessageSendType.Group) {
        return await userStore.getUser(fromId)
      } else {
        throw new Error("not supported.")
      }
    }

    chatStore.onPrivateChat(async (message: ChatMessage) => {
      if (message.sessionId === roomMessage?.id) {
        message.fromUser = await getUser(message.fromId)
        roomMessage?.messages.push(message)
        newMessageCallback.forEach(callback => {
          callback(message);
        });
      }
    })

    const loadData = async (isFrst: boolean = false) => {
      try {
        loading.value = true
        const paged = await history(roomMessage.session.id, 1)
        if (!paged.succeeded) {
          throw new Error((paged.errors ?? "").toString())
        }

        if (!paged.data || paged.data.items.length <= 0) {
          return;
        }

        paged.data.items.forEach(async (item: ChatMessage) => {
          item.fromUser = await getUser(item.fromId)
          roomMessage?.messages.unshift(item)
        })
        const maxId = Math.max(...paged.data.items.map((item: ChatMessage) => item.id));
        sessionStore.clearUnreadCount(roomMessage.session.id);
        if (isFrst && maxId > 0)
          chatStore.updateReadPosition(roomMessage.session.id, maxId)
      } catch (err) {
        ElMessage.error(err as string)
      } finally {
        loading.value = false
      }
    }

    const addMessage = (message: ChatMessage) => {
      roomMessage!.messages.push(message)
      sessionStore.clearUnreadCount(roomMessage!.session.id)
    }

    const sendFile = (file: File): void => {
      const image: string = URL.createObjectURL(file);

      const attachment: Attachment = {
        id: getNextId(),
        name: file.name,
        rawPath: image,
        previewPath: image,
        hash: "",
        contentType: file.type,
        size: file.size
      }

      const message = reactive<ChatMessage>({
        id: getNextId(),
        fromId: currentUserStore.userInfo?.id!,
        toId: roomMessage.session.toId,
        sessionId: roomMessage.session.id,
        sendType: ChatMessageSendType.Personal,
        messageType: fileTypeToMessageType(file.type),
        content: attachment,
        createTime: getNextId(),
        fromUser: currentUserStore.userInfo,
        status: ChatMessageStatus.Sending
      })

      upload(file, {
        onUploadProgress: ({ loaded, total }) => {
          attachment.progress = loaded / (total ?? file.size)
        }
      }).then(uploadResult => {
        if (!uploadResult.succeeded) {
          message.status = ChatMessageStatus.Failed
          return
        }

        message.content = reactive(uploadResult.data as Attachment)

        sendFileApi({
          toId: roomMessage!.session.toId,
          attachmentId: message.content.id,
          sendType: ChatMessageSendType.Personal
        }).then(({ succeeded, data }) => {
          if (!succeeded) {
            message.status = ChatMessageStatus.Failed;
            return
          }

          message.id = data!.id
          message.createTime = data!.createTime
          message.status = ChatMessageStatus.Succeeded
        }).catch(err => {
          message.status = ChatMessageStatus.Failed
          ElNotification.error(err)
        })
      }).catch(err => {
        ElNotification.error(err)
      })
      addMessage(message);
    }

    const sendText = (content: string) => {
      const message = reactive<ChatMessage>({
        id: getNextId(),
        fromId: currentUserStore.userInfo?.id!,
        toId: roomMessage!.session.toId!,
        sessionId: roomMessage!.session.id,
        sendType: ChatMessageSendType.Personal,
        messageType: ChatMessageType.Text,
        content: content,
        createTime: getNextId(),
        fromUser: currentUserStore.userInfo,
        status: ChatMessageStatus.Sending
      })

      sendTextApi({
        toId: roomMessage.session.toId,
        sendType: ChatMessageSendType.Personal,
        message: content
      }).then(({ succeeded, data }) => {
        if (!succeeded) {
          message.status = ChatMessageStatus.Failed;
          return
        }

        message.id = data!.id
        message.createTime = data!.createTime
        message.status = ChatMessageStatus.Succeeded
      }).catch(err => {
        message.status = ChatMessageStatus.Failed;
        ElNotification.error(err)
      })

      addMessage(message);
    }

    const newMessageCallback: NewMessageCallback[] = []

    const onNewMessage = (callback: NewMessageCallback) => {
      newMessageCallback.push(callback)
    }

    return {
      loading: computed(() => loading.value),
      messages: readonly(roomMessage.messages),
      loadData,
      sendText,
      sendFile,
      clearUnread: () => {
        sessionStore.clearUnreadCount(roomMessage.session.id)
        chatStore.updateReadPosition(roomMessage.session.id, roomMessage.messages[roomMessage.messages.length - 1].id)
      },
      onNewMessage
    }
  }

  return {
    getRoomMessage
  }
}
