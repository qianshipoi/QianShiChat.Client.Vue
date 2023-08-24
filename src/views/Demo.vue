<template>
  <div class="demo">
    <ChatMessage v-model="textMessage" />
    <ChatMessage v-model="imageMessage" />
    <ChatMessage v-model="otherFileMessage" />
    <!-- <ChatMessage v-model="textMessage" is-self />
    <ChatMessage v-model="imageMessage" is-self />
    <ChatMessage v-model="otherFileMessage" is-self /> -->
  </div>
</template>

<script setup lang='ts'>
import ChatMessage from '../components/ChatMessage/index.vue'
import { ChatMessageStatus, UserInfo } from '../types/Types';
import { ChatMessageSendType, ChatMessage as ChatMessageClass, ChatMessageType } from '../types/Types';

const userinfo: UserInfo = {
  id: 1,
  account: "",
  nickName: "qianshi",
  avatar: "http://localhost:5224/Raw/DefaultAvatar/1.jpg",
  createTime: new Date().getTime()
}

const textMessage: ChatMessageClass = {
  id: 0,
  fromId: 1,
  toId: 2,
  sessionId: '1-2',
  sendType: ChatMessageSendType.Personal,
  messageType: ChatMessageType.Text,
  content: "文字消息",
  createTime: new Date().getTime(),
  fromUser: userinfo,
  status: ChatMessageStatus.succeeded
}

const imageMessage: ChatMessageClass = {
  ...textMessage,
  messageType: ChatMessageType.Image,
  content: {
    id: 1,
    name: "1.jpg",
    rawPath: "http://localhost:5224/Raw/DefaultAvatar/1.jpg",
    previewPath: "http://localhost:5224/Raw/DefaultAvatar/1.jpg",
    hash: "a419483e502521bcfa4feca8c1833be9",
    contentType: "image/jpeg",
    size: 209904
  },
}

const otherFileMessage: ChatMessageClass = {
  ...imageMessage,
  messageType: ChatMessageType.OtherFile
}

</script>
