import { createI18n } from 'vue-i18n'
import enUs from './en-us'
import zhCn from './zh-cn'

export enum LocaleLang {
  ZH = 'zh-cn',
  EN = 'en-us'
}

const messages = {
  [LocaleLang.ZH]: zhCn,
  [LocaleLang.EN]: enUs,
}

function getLanguage(): string {
  return localStorage.getItem('lang') ? localStorage.getItem('lang')! : LocaleLang.ZH.toString()
}

const i18n: any = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getLanguage(),
  fallbackLocale: LocaleLang.ZH.toString(),
  messages
})

export default i18n;
