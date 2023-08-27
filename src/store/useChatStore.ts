import { defineStore } from "pinia";
import * as signalr from "@microsoft/signalr"
import { useCurrentUserStore } from "./useCurrentUserStore";
import { ChatMessage, Session } from "../types/Types";
import { ElNotification } from "element-plus";

export const useChatStore = defineStore("chat", () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/Hubs/Chat"

  const currentUserStore = useCurrentUserStore()
  const isReady = ref<boolean>(false)

  const connection = new signalr.HubConnectionBuilder()
    .withUrl(BASE_URL, { accessTokenFactory: () => currentUserStore.token })
    .withAutomaticReconnect()
    .build();

  const privateChatEventHandler: ((message: ChatMessage) => void)[] = []

  connection.on("PrivateChat", (message: ChatMessage) => {
    privateChatEventHandler.map(item => {
      item(message)
    })
  })

  const getCounter = () => connection.stream("Counter", 10, 2000)
    .subscribe({
      next: (item) => {
        ElNotification.info("next: " + item);
      },
      complete: () => {
        ElNotification.success("complete");
      },
      error: (err) => ElNotification.error(err)
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

  const start = async () => {
    await connection.start();
    isReady.value = true;
    getCounter()
  }

  const close = async () => {
    await connection.stop()
    isReady.value = false
  }

  return {
    isReady: computed(() => isReady.value),
    start,
    close,
    onPrivateChat,
    getSessions,
    updateReadPosition,
    subscribeSessions
  }
})
