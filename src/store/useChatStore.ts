import { defineStore } from "pinia";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { ChatMessage, ChatMessageSendType, NotificationMessage, Session } from "../types/Types";
import { ElNotification } from "element-plus";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

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

  const notificationEventHandler: ((notification: NotificationMessage) => void)[] = []

  connection.on("Notification", (notification: NotificationMessage) => {
    notificationEventHandler.forEach((item) => item(notification));
  })

  type SubscribeCallback<T> = {
    next: (item: T) => void,
    complate?: () => void,
    error?: (err: any) => void
  }

  const subscribeSessions = (callback: SubscribeCallback<Session>) => connection.stream("GetSessionsAsync")
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

  const getSessions = async (): Promise<Session[]> => {
    return await connection.invoke<Session[]>("GetSessionsAsync")
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
    return await connection.invoke<Session | null>("GetRoomAsync", toId, type)
  }

  const start = async () => {
    await connection.start();
    isReady.value = true;
  }

  const close = async () => {
    await connection.stop()
    isReady.value = false
  }

  return {
    isReady: readonly(isReady),
    start,
    close,
    onPrivateChat,
    getSessions,
    updateReadPosition,
    subscribeSessions,
    getRoom,
    onNotification
  }
})
