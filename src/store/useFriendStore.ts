import { defineStore } from "pinia";
import { ApplyStatus, FriendApply, FriendGroup, FriendInfo, NotificationMessage, NotificationType, UserInfo } from "../types/Types";
import { getFriends, approval as approvalApi, getFriendGroups } from "../api/friend";
import { useChatStore } from "./useChatStore";
import { ElNotification, NotificationHandle } from "element-plus";
import ApplyNotification from "../components/Notification/ApplyNotification.vue";
import { useSettingsStore } from "./useSettingsStore";
import { VNode } from "vue";
import { useRouter } from "vue-router";
import { useContactsStore } from "./useContactsStore";

interface ApplyNotificationHandle {
  apply: FriendApply;
  handle: NotificationHandle;
  instance: VNode
}

export const useFriendStore = defineStore("friend", () => {
  const friends = reactive<FriendInfo[]>([])
  const friendGroups = reactive<FriendGroup[]>([])
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore()
  const router = useRouter()
  const loading = ref(false)
  const contactsStore = useContactsStore()

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
        cache.instance.component?.exposed?.reset();
        return;
      }
      const instance = h(ApplyNotification, {
        apply,
        duration: settingsStore.notifceDuration,
        applyType: "friend",
        onSuccess: () => {
          approval(apply, ApplyStatus.Passed);
          handle.close();
        },
        onReject: () => {
          approval(apply, ApplyStatus.Rejected);
          handle.close();
        },
        onDetail: () => {
          router.push({ name: "Friend" })
          contactsStore.openFriendApply()
          handle.close()
        },
        onClose: () => {
          handle.close()
        }
      });
      const handle = ElNotification({
        title: "好友申请",
        duration: 0,
        message: instance,
        onClose: () => {
          removeApplyNotice(handle);
        }
      })
      applyNotice.push({
        apply,
        handle,
        instance
      })

    } else if (notification.type === NotificationType.NewFriend) {

    }
  });

  const loadData = async () => {
    await Promise.all([getFriends(), getFriendGroups()]).then(([friendsResult, groupsResult]) => {
      if (friendsResult.succeeded) {
        friends.splice(0, friends.length, ...friendsResult.data!);
      }

      if (groupsResult.succeeded) {
        friendGroups.splice(0, friendGroups.length, ...groupsResult.data!);
        if (friendGroups.length === 0) {
          friendGroups.push({
            id: 0,
            name: "默认分组",
            createTime: 0,
            isDefault: true,
            sort: 0,
            friends: [],
            totalCount: 0
          })
        }
        friends.forEach(friend => {
          const group = friendGroups.find(x => x.id === friend.friendGroupId);
          if (group) {
            group.friends.push(friend);
          }
        });
      }
    });
  }

  const isFriend = (id: number): boolean => {
    return friends.some(friend => friend.id === id);
  }

  const getFriendById = (id: number): UserInfo | undefined => {
    return friends.find(x => x.id === id)
  }

  const approval = async (apply: FriendApply, type: ApplyStatus) => {
    loading.value = true;
    try {
      const { succeeded, errors } = await approvalApi(apply.id, type)
      if (succeeded) {
        apply.status = type
      } else {
        ElNotification.error(errors as string);
      }
    } catch (error) {
      ElNotification.error(error as string);
    } finally {
      loading.value = false
    }
  }

  return {
    friends: readonly(friends),
    loading: readonly(loading),
    isFriend,
    loadData,
    getFriendById,
    approval
  }
})
