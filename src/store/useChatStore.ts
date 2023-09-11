import { defineStore } from "pinia";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { ChatMessage, ChatMessageSendType, FileOnlineTransmission, NotificationMessage, NotificationType, Room } from "../types/Types";
import { Action, ElMessageBox, ElNotification } from "element-plus";
import { HubConnectionBuilder, LogLevel, Subject } from "@microsoft/signalr";
import { useI18n } from "vue-i18n";
import { base64ToFile, fileToBase64 } from "../utils";

type SubscribeCallback<T> = {
  next: (item: T) => void,
  complate?: () => void,
  error?: (err: any) => void
}

export const useChatStore = defineStore("chat", () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/Hubs/Chat"

  const currentUserStore = useCurrentUserStore()
  const isReady = ref<boolean>(false)

  const connection = new HubConnectionBuilder()
    .withUrl(BASE_URL, { accessTokenFactory: () => currentUserStore.token })
    .withAutomaticReconnect()
    .configureLogging(import.meta.env.MODE === "production" ? LogLevel.Warning : LogLevel.Debug)
    .build();

  connection.onclose((err: Error | undefined) => {
    console.log("onclose", err);
    isReady.value = false
  })

  connection.onreconnected((connectionId: string | undefined) => {
    console.log("onreconnected", connectionId);
    isReady.value = true;
  })

  const privateChatEventHandler: ((message: ChatMessage) => void)[] = []


  connection.on("PrivateChat", (message: ChatMessage) => {
    privateChatEventHandler.map(item => {
      item(message)
    })
  })

  connection.on("OnlineFileReceive", (message: FileOnlineTransmission) => {
    let data: string = ""
    connection.stream<string>("OnlineReceiveFileStream", message.id)
      .subscribe({
        next: (val: string) => {
          console.log('receive ' + val.length)
          data += val;
        },
        complete: () => {
          console.log('complate ' + data.length)
          const file = base64ToFile(data, message.fileInfo.name, message.fileInfo.contentType);
          const img = document.createElement('img')
          img.src = URL.createObjectURL(file)
          document.body.appendChild(img)
        },
        error: (err) => console.error(err)
      })
  })

  connection.on("ConfirmOnlineFile", (message: FileOnlineTransmission) => {
    return new Promise<boolean>((resolve) => {
      ElMessageBox.confirm(`是否接受来自[${message.fromId}]的在线文件[${message.fileInfo.name}]?`, "在线文件", {
        confirmButtonText: "接受",
        cancelButtonText: "拒绝",
        callback: (callback: Action) => {
          resolve(callback === "confirm");
        }
      })
    })
  })

  const notificationEventHandler: ((notification: NotificationMessage) => void)[] = []

  connection.on("Notification", (notification: NotificationMessage) => {
    if (notification.type === NotificationType.Signed) {
      const { t } = useI18n();
      currentUserStore.logout();
      ElMessageBox.alert(t('signed'), t('actions.warning'), {
        confirmButtonText: t('actions.confirm'),
        showClose: false,
        closeOnClickModal: false
      })
      return;
    }
    notificationEventHandler.forEach((item) => item(notification));
  })

  const subscribeRooms = (callback: SubscribeCallback<Room>) => connection.stream("GetRoomsAsync")
    .subscribe({
      next: callback.next,
      complete: () => callback.complate && callback.complate(),
      error: (err) => {
        if (callback.error) {
          callback.error(err);
        } else {
          ElNotification.error(err)
        }
      }
    })

  const getRooms = async (): Promise<Room[]> => {
    return await connection.invoke<Room[]>("GetRoomsAsync")
  }

  const updateReadPosition = async (roomId: string, position: number): Promise<any> => {
    return await connection.invoke("ReadPositionAsync", roomId, position);
  }

  const onPrivateChat = (callback: (message: ChatMessage) => void) => {
    privateChatEventHandler.push(callback)
  }

  const onNotification = (callback: (notification: NotificationMessage) => void) => {
    notificationEventHandler.push(callback);
  }

  const getRoom = async (toId: number, type: ChatMessageSendType) => {
    return await connection.invoke<Room | null>("GetRoomAsync", toId, type)
  }

  const userIsOnline = async (id: number) => {
    return await connection.invoke<boolean>("UserIsOnline", id);
  }

  const start = async () => {
    await connection.start();
    isReady.value = true;
  }

  const close = async () => {
    await connection.stop()
    isReady.value = false
  }

  const onlineFile = async (toId: number, file: File) => {
    const channelId = await connection.invoke<string>("OnlineFileStreamConfirm", toId, {
      name: file.name,
      contentType: file.type,
      size: file.size
    });
    if (channelId && channelId.length > 0) {
      const subject = new Subject<string>();
      const data = await fileToBase64(file);
      const chunks = data.match(/.{1,25000}/g);
      connection.send("OnlineUploadFileStream", subject, channelId);
      chunks?.forEach((chunk: string) => {
        subject.next(chunk)
      })
      subject.complete()
    } else {
      ElNotification.error("对方已拒绝")
    }
  }

  return {
    isReady: readonly(isReady),
    start,
    close,
    onPrivateChat,
    getRooms,
    updateReadPosition,
    subscribeRooms,
    getRoom,
    onNotification,
    userIsOnline,
    onlineFile
  }
})
