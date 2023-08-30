import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

const NOTIFCE_DEFAULT_DURATION = 4500;

export const useSettingsStore = defineStore("settings", () => {
  const isFirstTime = useLocalStorage<boolean>("is_firet_time_join_app", true)
  const notifceDuration = useLocalStorage<number>("notifce_duration", NOTIFCE_DEFAULT_DURATION);

  return {
    isFirstTime: readonly(isFirstTime),
    getStart: () => isFirstTime.value = false,
    notifceDuration: readonly(notifceDuration)
  }
})
