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
      // ElNotification.info(`收到来自[${apply.friend.nickName}]的好友申请，备注：${apply.remark}`)
      console.log(apply.friend.avatar);

      ElNotification.info({
        title: "好友申请",
        message: h(ElImage, { src: apply.friend.avatar }),
        duration: 0
      })
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
