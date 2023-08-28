import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", () => {
  const isFirstTime = useLocalStorage<boolean>("is_firet_time_join_app", true)

  const getStart = () => {
    isFirstTime.value = false;
  }

  return {
    isFirstTime: computed(() => isFirstTime.value),
    getStart
  }
})
