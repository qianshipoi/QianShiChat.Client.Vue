import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { UserInfo } from "../types/Types";
import { login as loginApi } from "../api/auth";
import { useRouter } from "vue-router";
import { useSessionStorage, useTitle } from "@vueuse/core";
import { useChatStore } from "./useChatStore";

export const useCurrentUserStore = defineStore('current_user', () => {
  const token = useSessionStorage('token', '')
  const userInfo = ref<UserInfo>()
  const isAuthenticated = computed(() => !!token.value);
  const loading = ref<boolean>(false)
  const router = useRouter()
  const title = useTitle()
  const chatStore = useChatStore()

  watchEffect(() => {
    title.value = userInfo.value?.nickName ?? "QianShiChat - Vue"
  })

  const login = async (account: string, password: string): Promise<boolean> => {
    loading.value = true;
    try {
      const result = await loginApi(account, password)
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
    chatStore.close();
    router.push({ name: "Login" })
  }

  const changeToken = (accessToken: string) => {
    token.value = accessToken
  }

  return {
    token: readonly(token),
    loading: readonly(loading),
    userInfo,
    isAuthenticated,
    login,
    logout,
    changeToken
  }
}, {
  persist: {
    key: 'user',
    paths: ['userInfo', 'isAuthenticated'],
    storage: window.sessionStorage
  }
})
