<template>
  <div class="demo" style="height: 100%;">
    <DropFilePanel @drop="dropHandle">

      <AudioRecorder />

      <ChatMessage v-model="textMessage" />
      <ChatMessage v-model="imageMessage" />
      <!-- <ChatMessage v-model="auidoMessage" /> -->
      <ChatMessage v-model="otherFileMessage" />
      <!-- <ChatMessage v-model="textMessage" is-self />
      <ChatMessage v-model="imageMessage" is-self />
      <ChatMessage v-model="auidoMessage" is-self />
      <ChatMessage v-model="otherFileMessage" is-self />
      <AddFriendSearch :model-value="false"></AddFriendSearch>
      <button @click="showFriendApplyNotification">show apply notification</button> -->

      <Menu></Menu>

      <UploadFileControl ref="uploadFileControlRef" v-if="showUploadFileControl" :file="dropFile!"
        style="position: absolute; bottom: 20px; width: calc(100% - 40px); left: 20px; right: 20px;"
        @cancel="cancelUploadHandle" @completed="uploadCompletedHandle" />
    </DropFilePanel>
    <!-- <ChatMessage v-model="textMessage" />
    <ChatMessage v-model="imageMessage" />
    <ChatMessage v-model="otherFileMessage" />
    <ChatMessage v-model="textMessage" is-self />
    <ChatMessage v-model="imageMessage" is-self />
    <ChatMessage v-model="otherFileMessage" is-self />
    <AddFriendSearch :model-value="true"></AddFriendSearch>
    <button @click="showFriendApplyNotification">show apply notification</button> -->
  </div>
</template>

<script setup lang='ts'>
import ChatMessage from '../components/ChatMessage/index.vue'
import { Attachment, ChatMessageStatus, UserInfo } from '../types/Types';
import { ChatMessageSendType, ChatMessage as ChatMessageClass, ChatMessageType } from '../types/Types';
import { ElNotification } from 'element-plus';
import DropFilePanel from '../components/DropFilePanel/DropFilePanel.vue';
import UploadFileControl from '../components/UploadFileControl/UploadFileControl.vue';

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
  roomId: '1-2',
  sendType: ChatMessageSendType.Personal,
  messageType: ChatMessageType.Text,
  content: "文字消息",
  createTime: new Date().getTime(),
  fromUser: userinfo,
  status: ChatMessageStatus.Succeeded,
  attachments: []
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
// const auidoMessage: ChatMessageClass = {
//   ...imageMessage,
//   messageType: ChatMessageType.Audio,
//   status: ChatMessageStatus.Succeeded,
//   content: {
//     id: 1,
//     name: "1551470082826313728.mp3",
//     rawPath: "http://localhost:5224/files/461201462808645.mp3",
//     previewPath: undefined,
//     hash: "8d3186c00a453ca11a169d1a575692a4",
//     contentType: "audio/mpeg",
//     size: 2772823
//   },
//   attachments: []
// }

const otherFileMessage: ChatMessageClass = {
  ...imageMessage,
  messageType: ChatMessageType.OtherFile,
  status: ChatMessageStatus.Failed
}

// const showFriendApplyNotification = () => {
//   const apply: FriendApply = {
//     id: 0,
//     userId: userinfo.id,
//     friendId: userinfo.id,
//     createTime: Date.now(),
//     remark: "测试",
//     status: ApplyStatus.Applied,
//     user: userinfo,
//     friend: userinfo
//   }

//   ElNotification({
//     title: "好友申请",
//     duration: 10000,
//     message: h('div', { class: 'apply-notification' }, [
//       h(ElImage, { src: apply.friend.avatar }),
//       h('div', { class: 'apply-notification-content' }, [
//         h('p', `收到来自[${apply.friend.nickName}]的好友申请，备注：${apply.remark}`),
//         h('div', { class: 'apply-notification-actions' }, [
//           h('button', { class: 'success' }, "同意"),
//           h('button', { class: 'warning' }, "驳回"),
//           h('button', "详情")
//         ])
//       ])
//     ])
//   })
// }

const showUploadFileControl = ref(false);

const uploadFileControlRef = ref<InstanceType<typeof UploadFileControl>>()

const dropFile = shallowRef<File | null>()

const dropHandle = async (files: File[]) => {
  dropFile.value = files[0]
  showUploadFileControl.value = true;
  await nextTick()
  uploadFileControlRef.value?.start();
}

const uploadCompletedHandle = (attachment: Attachment) => {
  showUploadFileControl.value = false;
  ElNotification.success('上传完毕')
  console.log(attachment);
}
const cancelUploadHandle = () => {
  showUploadFileControl.value = false;
  ElNotification.warning('取消上传')
}

</script>
