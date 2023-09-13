import { history } from "../../api/chat"
import { useChatStore } from "../../store/useChatStore"
import { useRoomStore } from "../../store/useRoomStore"
import { useUserStore } from "../../store/useUserStore"
import { Attachment, ChatMessage, ChatMessageSendType, ChatMessageStatus, ChatMessageType, Room, UserInfo } from "../../types/Types"
import { ElMessage, ElNotification } from "element-plus"
import { sendText as sendTextApi, sendFile as sendFileApi } from "../../api/chat";
import { useCurrentUserStore } from "../../store/useCurrentUserStore"
import { bindTusFile, upload } from "../../api/attachment"
import { TusUpload } from "../../utils/tusUtils"

type RoomMessages = {
  id: String,
  room: Room,
  messages: ChatMessage[]
}

type NewMessageCallback = (message: ChatMessage) => void

export const useChatMessage = () => {
  const roomMessages = reactive<RoomMessages[]>([])
  const userStore = useUserStore()
  const roomStore = useRoomStore()
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
        room: roomStore.opendRoomRaw!,
        messages: reactive([])
      }
      roomMessages.push(roomMessage)
    }

    const isPersonalRoom = (): boolean => roomMessage?.room.type === ChatMessageSendType.Personal;

    const getUser = async (fromId: number): Promise<UserInfo> => {
      if (fromId === currentUserStore.userInfo?.id) {
        return currentUserStore.userInfo;
      }

      if (isPersonalRoom()) {
        return roomMessage!.room.toObject as UserInfo
      } else if (roomMessage!.room.type === ChatMessageSendType.Group) {
        return await userStore.getUser(fromId)
      } else {
        throw new Error("not supported.")
      }
    }

    chatStore.onPrivateChat(async (message: ChatMessage) => {
      if (message.roomId === roomMessage?.id) {
        message.fromUser = await getUser(message.fromId)
        roomMessage?.messages.push(message)
        newMessageCallback.forEach(callback => {
          callback(message);
        });
      }
    })
    let page = 1;
    let hasMore = ref<boolean>(true);

    const loadData = async (isFrst: boolean = false) => {
      if (loading.value || !hasMore.value) {
        return;
      }

      try {
        loading.value = true
        const paged = await history(roomMessage.room.id, page)
        if (!paged.succeeded) {
          throw new Error((paged.errors ?? "").toString())
        }

        if (!paged.data || paged.data.items.length <= 0) {
          hasMore.value = false
          return;
        }
        hasMore.value = paged.data.hasNext
        page++;
        paged.data.items.forEach(async (item: ChatMessage) => {
          item.fromUser = await getUser(item.fromId)
          roomMessage?.messages.unshift(item)
        })
        const maxId = Math.max(...paged.data.items.map((item: ChatMessage) => item.id));
        roomStore.clearUnreadCount(roomMessage.room.id);
        if (isFrst && maxId > 0)
          chatStore.updateReadPosition(roomMessage.room.id, maxId)
      } catch (err) {
        ElMessage.error(err as string)
      } finally {
        loading.value = false
      }
    }

    const addMessage = (message: ChatMessage) => {
      roomMessage!.messages.push(message)
      roomStore.clearUnreadCount(roomMessage!.room.id)
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
        toId: roomMessage.room.toId,
        roomId: roomMessage.room.id,
        sendType: ChatMessageSendType.Personal,
        messageType: fileTypeToMessageType(file.type),
        content: attachment,
        createTime: getNextId(),
        fromUser: currentUserStore.userInfo,
        status: ChatMessageStatus.Sending
      })

      const sendFileMessage = (message: ChatMessage) => {
        sendFileApi({
          toId: roomMessage!.room.toId,
          attachmentId: (message.content as Attachment).id,
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
      }

      if (file.size > 1024 * 1024 * 30) {
        const upload = new TusUpload(file)
          .addAuthorizationFactory(() => `Bearer ${currentUserStore.token}`)
          .setProgress((loaded, total) => {
            attachment.progress = loaded / (total ?? file.size)
          })
          .setSuccess((fileId: string) => {
            // todo: no response。
            // message.content = reactive(uploadResult.data as Attachment)

            bindTusFile(fileId).then(res => {
              if (!res.succeeded) {
                throw new Error('upload file error.')
              }
              message.content = reactive(res.data as Attachment);
              sendFileMessage(message);
            }).catch(err => {
              ElNotification.error(err)
            })
          })
          .setError(() => {
            message.status = ChatMessageStatus.Failed;
          })
          .build();

        upload.start();
      } else {
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
          sendFileMessage(message);
        }).catch(err => {
          ElNotification.error(err)
        })
      }

      addMessage(message);
    }

    const sendAttachment = (attachment: Attachment): void => {
      const message = reactive<ChatMessage>({
        id: getNextId(),
        fromId: currentUserStore.userInfo?.id!,
        toId: roomMessage.room.toId,
        roomId: roomMessage.room.id,
        sendType: ChatMessageSendType.Personal,
        messageType: fileTypeToMessageType(attachment.contentType),
        content: attachment,
        createTime: getNextId(),
        fromUser: currentUserStore.userInfo,
        status: ChatMessageStatus.Sending
      })
      sendFileApi({
        toId: roomMessage!.room.toId,
        attachmentId: attachment.id,
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
      addMessage(message);
    }

    const sendText = (content: string) => {
      const message = reactive<ChatMessage>({
        id: getNextId(),
        fromId: currentUserStore.userInfo?.id!,
        toId: roomMessage!.room.toId!,
        roomId: roomMessage!.room.id,
        sendType: ChatMessageSendType.Personal,
        messageType: ChatMessageType.Text,
        content: content,
        createTime: getNextId(),
        fromUser: currentUserStore.userInfo,
        status: ChatMessageStatus.Sending
      })

      sendTextApi({
        toId: roomMessage.room.toId,
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
      loading: readonly(loading),
      messages: readonly(roomMessage.messages),
      loadData,
      sendText,
      sendFile,
      clearUnread: () => {
        roomStore.clearUnreadCount(roomMessage.room.id)
        chatStore.updateReadPosition(roomMessage.room.id, roomMessage.messages[roomMessage.messages.length - 1].id)
      },
      onNewMessage,
      sendAttachment,
      hasMore: readonly(hasMore)
    }
  }

  return {
    getRoomMessage
  }
}
