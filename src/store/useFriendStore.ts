import { defineStore } from "pinia";
import { UserInfo } from "../types/Types";
import { getFriends } from "../api/friend";

export const useFriendStore = defineStore("friend", () => {
  const friends = reactive<UserInfo[]>([])

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
