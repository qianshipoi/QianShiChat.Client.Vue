import { defineStore } from "pinia";
import { ApplyStatus, Group, GroupApply, NotificationMessage, NotificationType, UserInfo } from "../types/Types";
import { useChatStore } from "./useChatStore";
import { useSettingsStore } from "./useSettingsStore";
import { useI18n } from "vue-i18n";
import { ElNotification, NotificationHandle } from "element-plus";
import ApplyNotification from "../components/Notification/ApplyNotification.vue";
import { create, del, getAll, join, leave, getMembers, getGroup as getGroupApi, approval as approvalApi } from "../api/group";
import { useGroupDb } from "./db/useGroupDb";
import { VNode } from "vue";
import { useRouter } from "vue-router";

interface ApplyNotificationHandle {
  apply: GroupApply;
  handle: NotificationHandle;
  instance: VNode;
}

export const useGroupStore = defineStore("group", () => {
  const groups = reactive<Group[]>([])
  const loading = ref<boolean>(false)

  const chatStore = useChatStore();
  const settingsStore = useSettingsStore()
  const router = useRouter()
  const groupDb = useGroupDb()

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
        cache.instance.component?.exposed?.reset();
        return;
      }
      const instance = h(ApplyNotification, {
        apply,
        duration: settingsStore.notifceDuration,
        applyType: "group",
        onSuccess: () => {
          approval(apply, 'pass')
          handle.close();
        },
        onReject: () => {
          approval(apply, 'reject')
          handle.close();
        },
        onDetail: () => {
          router.push({ name: "GroupApply" })
          handle.close()
        },
        onClose: () => {
          handle.close()
        }
      });
      const handle = ElNotification({
        title: "加群申请",
        duration: 0,
        message: instance,
        onClose: () => {
          removeApplyNotice(handle);
        }
      })
      applyNotice.push({
        instance,
        apply,
        handle
      })
    } else if (notification.type === NotificationType.NewGroup) {
      // add group.
    }
  });

  const approval = async (apply: GroupApply, status: 'pass' | 'reject' | 'ignore') => {
    loading.value = true;
    try {
      const { succeeded, errors } = await approvalApi(
        apply.id,
        status
      )
      if (succeeded) {
        switch (status) {
          case 'pass':
            apply.status = ApplyStatus.Passed;
            break;
          case 'reject':
            apply.status = ApplyStatus.Rejected;
            break;
          case 'ignore':
            apply.status = ApplyStatus.Ignored;
            break;
        }
      } else {
        ElNotification.error(errors as string);
      }
    } catch (error) {
      ElNotification.error(error as string);
    } finally {
      loading.value = false
    }
  }

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

  const loadMembers = async (groupId: number) => {
    loading.value = true;
    try {
      const { succeeded, data, errors } = await getMembers(groupId, { page: 1, size: 10 });
      if (!succeeded) {
        throw new Error(errors as string)
      }
      const group = groups.find(x => x.id === groupId)
      group && (group.users = data?.items)
    } catch (error: any) {
      ElNotification.error(error)
      return false
    } finally {
      loading.value = false
    }
  }

  const getGroup = async (groupId: number): Promise<Group> => {
    let group = groups.find(x => x.id === groupId)
    if (group) return group;

    group = await groupDb.get(groupId);
    if (group) return group;

    loading.value = true;
    try {
      const { succeeded, data, errors } = await getGroupApi(groupId)
      if (!succeeded) throw new Error(errors as string)
      groupDb.addOrUpdate(data!)
      return data!;
    } catch (error: any) {
      ElNotification.error(error)
    } finally {
      loading.value = false;
    }

    return Promise.reject()
  }

  return {
    groups: readonly(groups),
    loading: readonly(loading),
    joinedGroup: (id: number) => groups.some(item => item.id === id),
    loadData,
    createGroup,
    leaveGroup,
    deleteGroup,
    joinGroupApply,
    loadMembers,
    getGroup,
    approval
  }
})
