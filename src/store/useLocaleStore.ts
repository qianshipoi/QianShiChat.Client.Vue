import { defineStore } from "pinia";
import { LocaleLang } from "../lang";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";

export const useLocaleStore = defineStore("locale", () => {
  const DEFAULT_LANG = LocaleLang.ZH
  const { t, locale } = useI18n()

  const currentLang = useLocalStorage<LocaleLang>("lang", DEFAULT_LANG);

  const changeLang = (lang: LocaleLang) => {
    locale.value = lang.toString();
    currentLang.value = lang;
  }

  onMounted(() => {
    if (currentLang.value !== DEFAULT_LANG) {
      changeLang(currentLang.value)
    }
  })

  return {
    currentLang: computed(() => currentLang.value),
    t,
    changeLang
  }
})
