import { useColorMode, useLocalStorage } from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import { useLocaleStore } from "./useLocaleStore";

const NOTIFCE_DEFAULT_DURATION = 4500;
type Theme = 'auto' | 'dark' | 'light';

export const useSettingsStore = defineStore("settings", () => {
  const isFirstTime = useLocalStorage<boolean>("is_firet_time_join_app", true)
  const notifceDuration = useLocalStorage<number>("notifce_duration", NOTIFCE_DEFAULT_DURATION);
  const localeStore = useLocaleStore();
  const { store: colorStore } = useColorMode()
  const { currentLang: language } = storeToRefs(localeStore)

  return {
    isFirstTime: readonly(isFirstTime),
    notifceDuration: readonly(notifceDuration),
    language: readonly(language),
    changeLanguage: localeStore.changeLang,
    theme: readonly(colorStore),
    changeTheme: (theme: Theme) => colorStore.value = theme,
    getStart: () => isFirstTime.value = false,
  }
})
