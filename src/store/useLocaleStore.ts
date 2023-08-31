import { defineStore } from "pinia";
import { LocaleLang } from "../lang";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const DEFAULT_LANG = LocaleLang.ZH
export const useLocaleStore = defineStore("locale", () => {
  const { t, locale } = useI18n()

  const currentLang = useLocalStorage<LocaleLang>("lang", DEFAULT_LANG);

  const changeLang = (lang: LocaleLang) => {
    locale.value = lang.toString();
    currentLang.value = lang;
    dayjs.locale(locale.value)
  }

  onMounted(() => {
    dayjs.locale('zh-cn')
    if (currentLang.value !== DEFAULT_LANG) {
      changeLang(currentLang.value)
    }
  })

  return {
    currentLang: readonly(currentLang),
    t,
    changeLang,
  }
})
