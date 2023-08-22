import { defineStore } from "pinia";
import * as signalr from "@microsoft/signalr"
import { useCurrentUserStore } from "./useCurrentUserStore";
import { ChatMessage } from "../types/Types";

export const useChatStore = defineStore("chat", () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL + "/Hubs/Chat"

  const currentUserStore = useCurrentUserStore()

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

  const onPrivateChat = (callback: (message: ChatMessage) => void) => {
    privateChatEventHandler.push(callback)
  }

  const start = async () => {
    await connection.start();
  }

  const close = async () => {
    await connection.stop()
  }

  return {
    start,
    close,
    onPrivateChat
  }
})
