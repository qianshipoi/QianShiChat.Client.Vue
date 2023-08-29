<template>
  <div class="demo">
    <ChatMessage v-model="textMessage" />
    <ChatMessage v-model="imageMessage" />
    <ChatMessage v-model="otherFileMessage" />
    <!-- <ChatMessage v-model="textMessage" is-self />
    <ChatMessage v-model="imageMessage" is-self />
    <ChatMessage v-model="otherFileMessage" is-self /> -->
    <!-- <AddFriendSearch :model-value="true"></AddFriendSearch> -->

    <button @click="showFriendApplyNotification">show apply notification</button>
  </div>
</template>

<script setup lang='ts'>
import ChatMessage from '../components/ChatMessage/index.vue'
import { ApplyStatus, ChatMessageStatus, FriendApply, UserInfo } from '../types/Types';
import { ChatMessageSendType, ChatMessage as ChatMessageClass, ChatMessageType } from '../types/Types';
import AddFriendSearch from '../components/AddFriendSearch.vue'
import { ElImage, ElNotification } from 'element-plus';

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
  status: ChatMessageStatus.Succeeded
}

const imageMessage: ChatMessageClass = {
  ...textMessage,
  messageType: ChatMessageType.Image,
  status: ChatMessageStatus.Sending,
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
  messageType: ChatMessageType.OtherFile,
  status: ChatMessageStatus.Failed
}

const showFriendApplyNotification = () => {
  const apply: FriendApply = {
    id: 0,
    userId: userinfo.id,
    friendId: userinfo.id,
    createTime: Date.now(),
    remark: "测试",
    status: ApplyStatus.Applied,
    user: userinfo,
    friend: userinfo
  }

  ElNotification({
    title: "好友申请",
    duration: 10000,
    message: h('div', { class: 'apply-notification' }, [
      h(ElImage, { src: apply.friend.avatar }),
      h('div', { class: 'apply-notification-content' }, [
        h('p', `收到来自[${apply.friend.nickName}]的好友申请，备注：${apply.remark}`),
        h('div', { class: 'apply-notification-actions' }, [
          h('button', { class: 'success' }, "同意"),
          h('button', { class: 'warning' }, "驳回"),
          h('button', "详情")
        ])
      ])
    ])
  })
}

</script>
