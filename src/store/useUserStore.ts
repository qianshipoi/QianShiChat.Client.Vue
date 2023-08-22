import { defineStore } from "pinia";
import { UserInfo } from "../types/Types";
import { getUserById } from "../api/user";


export const useUserStore = defineStore("user", () => {
  const users = reactive<UserInfo[]>([]);
  const loading = ref<boolean>(false)

  const getUser = async (id: number): Promise<UserInfo> => {
    let user = users.find(x => x.id === id);
    if (user) {
      return user;
    }

    try {
      loading.value = true
      const result = await getUserById(id);
      if (result.succeeded) {
        user = result.data!
        return user
      }
    } catch (err) {

    } finally {
      loading.value = false
    }

    return Promise.reject()
  }

  return {
    loading: computed(() => loading.value),
    getUser
  }
})
