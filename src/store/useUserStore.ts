import { defineStore } from "pinia";
import { UserInfo } from "../types/Types";
import { getUserById } from "../api/user";

export const useUserStore = defineStore("user", () => {
  const users = reactive<UserInfo[]>([]);
  const loading = ref<boolean>(false)

  const getUser = async (id: number): Promise<UserInfo> => {
    let user = users.find(x => x.id === id);
    if (user) return user;

    try {
      loading.value = true
      const { succeeded, data } = await getUserById(id);
      if (succeeded) {
        users.push(data!)
        return data!
      }
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false
    }

    return Promise.reject()
  }

  const getUsers = async (ids: number[]): Promise<UserInfo[]> => {
    const unionids = Array.from(new Set<number>(ids))
    const results = await Promise.all(unionids.map(id => getUserById(id)))
    return results.filter(result => result.succeeded).map(result => result.data!);
  }

  return {
    loading: computed(() => loading.value),
    getUser,
    getUsers
  }
})
