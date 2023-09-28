import { defineStore } from "pinia";
import { ref } from "vue";
import { UserInfo } from "../types/Types";
import { login as loginApi } from "../api/auth";
import { useRouter } from "vue-router";
import { StorageSerializers, useFavicon, useSessionStorage, useTitle } from "@vueuse/core";
import { useChatStore } from "./useChatStore";

export interface LoginParams {
  account: string
  password: string
}

export const useCurrentUserStore = defineStore("current_user", () => {
  const token = useSessionStorage("token", "")
  const userInfo = useSessionStorage<UserInfo>("user", null, {
    serializer: StorageSerializers.object
  })
  const loading = ref<boolean>(false)
  const router = useRouter()
  const title = useTitle()
  const chatStore = useChatStore()
  const favicon = useFavicon()

  watchEffect(() => {
    title.value = userInfo.value?.nickName ?? "QianShiChat - Vue"
  })

  watchEffect(() => {
    favicon.value = userInfo.value?.avatar
  })

  const login = async (params: LoginParams): Promise<boolean> => {
    loading.value = true;
    try {
      const result = await loginApi(params.account, params.password)
      if (!result.succeeded) {
        return false
      }
      userInfo.value = result.data
      return true
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false
    }
    return false
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null;
    chatStore.close();
    router.push({ name: "Login" })
  }

  const changeToken = (accessToken: string) => {
    token.value = accessToken
  }

  return {
    token: readonly(token),
    loading: readonly(loading),
    isAuthenticated: computed(() => !!token.value),
    userInfo: readonly(userInfo),
    login,
    logout,
    changeToken
  }
})
