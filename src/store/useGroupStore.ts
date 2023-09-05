import { defineStore } from "pinia";
import { Group, GroupApply, NotificationMessage, NotificationType, UserInfo } from "../types/Types";
import { useChatStore } from "./useChatStore";
import { useSettingsStore } from "./useSettingsStore";
import { useI18n } from "vue-i18n";
import { ElNotification, NotificationHandle } from "element-plus";
import ApplyNotification from "../components/Notification/ApplyNotification.vue";
import { create, del, getAll, join, leave } from "../api/group";


interface ApplyNotificationHandle {
  apply: GroupApply;
  handle: NotificationHandle;
  timer: number;
}

export const useGroupStore = defineStore("group", () => {
  const groups = reactive<Group[]>([])
  const loading = ref<boolean>(false)

  const chatStore = useChatStore();
  const settingsStore = useSettingsStore()
  const { t } = useI18n()

  const applyNotice: ApplyNotificationHandle[] = []

  function removeApplyNotice(handle: NotificationHandle) {
    const cacheIndex = applyNotice.findIndex(x => x.handle === handle);
    applyNotice.splice(cacheIndex, 1);
  }

  chatStore.onNotification((notification: NotificationMessage) => {
    if (notification.type === NotificationType.GroupApply) {
      const apply = reactive(notification.message as GroupApply);
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
            applyType: "group",
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

    } else if (notification.type === NotificationType.NewGroup) {
      // add group.
    }
  });

  const loadData = async () => {
    const result = await getAll()
    if (!result.succeeded) return;
    groups.push(...result.data!)
  }

  const createGroup = async (friends: UserInfo[], remark?: string) => {
    loading.value = true;
    try {
      const { succeeded, data, errors } = await create(friends.map(x => x.id), remark);
      if (!succeeded) {
        throw new Error(errors as string)
      }
      groups.unshift(data!);
      return true;
    } catch (error: any) {
      ElNotification.error(error)
      return false;
    } finally {
      loading.value = false
    }
  }

  const leaveGroup = async (groupId: number) => {
    loading.value = true;
    try {
      await leave(groupId);

      const index = groups.findIndex(x => x.id === groupId)
      if (index !== -1) {
        groups.splice(index, 1)
      }

      return true;
    } catch (error: any) {
      ElNotification.error(error)
      return false;
    } finally {
      loading.value = false;
    }
  }

  const deleteGroup = async (groupId: number) => {
    loading.value = true;
    try {
      await del(groupId);
      const index = groups.findIndex(x => x.id === groupId)
      if (index !== -1) {
        groups.splice(index, 1)
      }
      return true;
    } catch (error: any) {
      ElNotification.error(error)
      return false;
    } finally {
      loading.value = false;
    }
  }

  const joinGroupApply = async (groupId: number, remark: string) => {
    loading.value = true;
    try {
      await join(groupId, remark);
      return true;
    } catch (error: any) {
      ElNotification.error(error)
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    groups: readonly(groups),
    loading: readonly(loading),
    loadData,
    createGroup,
    leaveGroup,
    deleteGroup,
    joinGroupApply
  }
})
