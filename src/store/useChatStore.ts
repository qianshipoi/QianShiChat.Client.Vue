import { defineStore } from "pinia";
import * as signalr from "@microsoft/signalr"
import { useCurrentUserStore } from "./useCurrentUserStore";
import { ChatMessage, Session } from "../types/Types";

export const useChatStore = defineStore("chat", () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/Hubs/Chat"

  const currentUserStore = useCurrentUserStore()
  const isReady = ref<boolean>(false)

  const connection = new signalr.HubConnectionBuilder()
    .withUrl(BASE_URL, { accessTokenFactory: () => currentUserStore.token })
    .withAutomaticReconnect()
    .build();

  const privateChatEventHandler: ((message: ChatMessage) => void)[] = []

  connection.on("PrivateChat", function (message: ChatMessage) {
    privateChatEventHandler.map(item => {
      item(message)
    })
  })

  const getSessions = async (): Promise<Session[]> => {
    return await connection.invoke<Session[]>("GetSessionsAsync")
  }

  const onPrivateChat = (callback: (message: ChatMessage) => void) => {
    privateChatEventHandler.push(callback)
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
    start,
    close,
    onPrivateChat,
    getSessions,
    isReady: computed(() => isReady.value)
  }
})
