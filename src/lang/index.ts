import { createI18n } from 'vue-i18n'
import enUs from './en-us'
import zhCn from './zh-cn'

const messages = {
  enUs,
  zhCn
}

function getLanguage(): string {
  return localStorage.getItem('language') ? localStorage.getItem('language')! : 'zhCn'
}

const i18n: any = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getLanguage(),
  messages
})

export default i18n;
