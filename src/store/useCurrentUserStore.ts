import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { UserInfo } from "../types/Types";
import { login as loginApi } from "../api/auth";
import { useRouter } from "vue-router";

export const useCurrentUserStore = defineStore('current_user', () => {
  const token = ref<string>()
  const userInfo = ref<UserInfo>()
  const isAuthenticated = computed(() => !!token.value);
  const loading = ref<boolean>(false)
  const router = useRouter()

  const login = async (account: string, password: string): Promise<boolean> => {
    loading.value = true;
    try {
      const result = await loginApi(account, password)
      if (result.succeeded) {
        userInfo.value = result.data
      }
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
    userInfo.value = undefined
    router.push({ name: "Login" })
  }

  return {
    token,
    userInfo,
    isAuthenticated,
    loading: computed(() => loading.value),
    login,
    logout
  }
}, {
  persist: {
    key: 'user',
    paths: ['token', 'userInfo', 'isAuthenticated'],
    storage: window.sessionStorage
  }
})
