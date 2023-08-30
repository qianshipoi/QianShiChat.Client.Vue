import { defineStore } from "pinia";
import { FriendApply, NotificationMessage, NotificationType, UserInfo } from "../types/Types";
import { getFriends } from "../api/friend";
import { useChatStore } from "./useChatStore";
import { ElNotification, NotificationHandle } from "element-plus";
import { useI18n } from "vue-i18n";
import ApplyNotification from "../components/Notification/ApplyNotification.vue";
import { useSettingsStore } from "./useSettingsStore";

interface ApplyNotificationHandle {
  apply: FriendApply;
  handle: NotificationHandle;
  timer: number;
}

export const useFriendStore = defineStore("friend", () => {
  const friends = reactive<UserInfo[]>([])

  const chatStore = useChatStore();
  const settingsStore = useSettingsStore()
  const { t } = useI18n()

  const applyNotice: ApplyNotificationHandle[] = []

  function removeApplyNotice(handle: NotificationHandle) {
    const cacheIndex = applyNotice.findIndex(x => x.handle === handle);
    applyNotice.splice(cacheIndex, 1);
  }

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
      const apply = reactive(notification.message as FriendApply);
      const cache = applyNotice.find(x => x.apply.id === apply.id)

      if (cache) {
        cache.apply.remark = apply.remark;
        cache.timer && clearTimeout(cache.timer)
        cache.timer = setTimeout(() => {
          cache.handle.close()
        }, settingsStore.notifceDuration);
      } else {
        const handle = ElNotification({
          title: "好友申请",
          duration: 0,
          message: h(ApplyNotification, {
            apply,
            onSuccess: () => {
              console.log(t('actions.pass'));
              handle.close();
            },
            onReject: () => {
              console.log(t('actions.reject'));
            },
            onDetail: () => {
              console.log(t('actions.detail'));
            },
          }),
          onClose: () => {
            removeApplyNotice(handle);
          }
        })
        const timer = setTimeout(() => {
          handle.close()
        }, settingsStore.notifceDuration)
        applyNotice.push({
          timer,
          apply,
          handle
        })
      }

    } else if (notification.type === NotificationType.NewFriend) {

    }
  });

  const loadData = async () => {
    const result = await getFriends()
    if (!result.succeeded) return;
    friends.push(...result.data!)
  }

  const isFriend = (id: number): boolean => {
    return friends.some(friend => friend.id === id);
  }

  return {
    friends: readonly(friends),
    isFriend,
    loadData,
  }
})
