import { createI18n } from 'vue-i18n'
import enUs from './en-us'
import zhCn from './zh-cn'

enum LocalLang {
  ZH,
  EN
}

const messages = {
  [LocalLang.ZH]: zhCn,
  [LocalLang.EN]: enUs,
}

function getLanguage(): string {
  return localStorage.getItem('language') ? localStorage.getItem('language')! : LocalLang.ZH.toString()
}

const i18n: any = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getLanguage().toString(),
  fallbackLocale: LocalLang.ZH.toString(),
  messages
})

export default i18n;
