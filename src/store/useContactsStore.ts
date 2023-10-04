import { defineStore } from "pinia";
import { Group, UserInfo } from "../types/Types";
import { UserProfileProps } from "../components/Profile/UserProfile.vue";
import { GroupProfileProps } from "../views/friend/GroupProfile.vue";

export const useContactsStore = defineStore("contacts", () => {
  const UserProfile = defineAsyncComponent(() => import("../views/friend/UserProfile.vue"));
  const GroupProfile = defineAsyncComponent(() => import("../views/friend/GroupProfile.vue"));
  const FriendApply = defineAsyncComponent(() => import("../views/friend/FriendApply.vue"));
  const GroupApply = defineAsyncComponent(() => import("../views/friend/GroupApply.vue"));

  const opendComponent = shallowRef<any>()
  const opendComponentProps = ref<UserProfileProps | GroupProfileProps | {}>({})
  const opendComponentVisible = ref(false)

  const selected = computed(() => {
    if (opendComponent.value === UserProfile) {
      return (opendComponentProps.value as UserProfileProps).user;
    } else if (opendComponent.value === GroupProfile) {
      return (opendComponentProps.value as GroupProfileProps).group;
    } else {
      return undefined;
    }
  });

  function openUserProfile(user: UserInfo) {
    openComponent(UserProfile, { user });
  }

  function openGroupProfile(group: Group) {
    openComponent(GroupProfile, { group });
  }

  function openFriendApply() {
    openComponent(FriendApply, {});
  }

  function openGroupApply() {
    openComponent(GroupApply, {});
  }

  function openComponent(component: any, props: any) {
    opendComponent.value = component;
    opendComponentProps.value = props;
    opendComponentVisible.value = true;
  }

  function closeComponent() {
    opendComponentVisible.value = false;
  }

  return {
    opendComponent: shallowReadonly(opendComponent),
    opendComponentProps: readonly(opendComponentProps),
    opendComponentVisible: readonly(opendComponentVisible),
    openUserProfile,
    openGroupProfile,
    openFriendApply,
    openGroupApply,
    closeComponent,
    selected
  }
});
