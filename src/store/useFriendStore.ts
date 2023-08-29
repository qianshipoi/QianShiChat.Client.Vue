import { defineStore } from "pinia";
import { FriendApply, NotificationMessage, NotificationType, UserInfo } from "../types/Types";
import { getFriends } from "../api/friend";
import { useChatStore } from "./useChatStore";
import { ElImage, ElNotification } from "element-plus";

export const useFriendStore = defineStore("friend", () => {
  const friends = reactive<UserInfo[]>([])

  const chatStore = useChatStore();

  chatStore.onNotification((notification: NotificationMessage) => {
    if (notification.type === NotificationType.FriendOnline) {
      const user = friends.find(x => x.id === notification.message as number)
      if (user) {
        user.isOnline = true;
        ElNotification.info(`好友[${user?.nickName}]已上线`)
      }
    } else if (notification.type === NotificationType.FriendOffline) {
      const user = friends.find(x => x.id === notification.message as number)
      if (user) {
        user.isOnline = false;
        ElNotification.info(`好友[${user?.nickName}]已下线`)
      }
    } else if (notification.type === NotificationType.FriendApply) {
      const apply = notification.message as FriendApply;
      const handle = ElNotification({
        title: "好友申请",
        duration: 10000,
        message: h('div', { class: 'apply-notification' }, [
          h(ElImage, { src: apply.user!.avatar }),
          h('div', { class: 'apply-notification-content' }, [
            h('p', `收到来自[${apply.user!.nickName}]的好友申请，备注：${apply.remark}`),
            h('div', { class: 'apply-notification-actions' }, [
              h('button', {
                class: 'success', onClick: () => {
                  console.log("同意");
                  handle.close()
                }
              }, "同意"),
              h('button', {
                class: 'warning', onClick: () => console.log("驳回")
              }, "驳回"),
              h('button', {
                onClick: () => console.log("详情")
              }, "详情")
            ])
          ])
        ])
      })
    } else if (notification.type === NotificationType.NewFriend) {
      
    }
  });

  const loadData = async () => {
    const result = await getFriends()
    if (!result.succeeded) return;
    friends.push(...result.data!)
  }

  return {
    friends: readonly(friends),
    loadData,
  }
})
