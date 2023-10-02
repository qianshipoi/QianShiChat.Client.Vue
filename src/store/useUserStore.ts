import { defineStore } from "pinia";
import { UserInfo } from "../types/Types";
import { getUserById } from "../api/user";
import { useUserDb } from "./db/useUserDb";
import { useFriendStore } from "./useFriendStore";

export const useUserStore = defineStore("user", () => {
  const loading = ref<boolean>(false)
  const friendStore = useFriendStore()
  const userDb = useUserDb()

  const getUser = async (id: number): Promise<UserInfo> => {
    let user = friendStore.getFriendById(id);
    if (user) return user;

    // from db cache
    user = await userDb.getById(id)
    if (user) return user

    // from api
    try {
      loading.value = true
      const { succeeded, data } = await getUserById(id);
      if (succeeded) {
        await userDb.addOrUpdate(data!)
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
    loading: readonly(loading),
    getUser,
    getUsers
  }
})
