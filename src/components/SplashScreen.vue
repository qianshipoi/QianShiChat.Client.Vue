<template>
  <div class="splash-screen" ref="splashScreen">
    <h1>{{ t('select_your_preferences') }}</h1>
    <el-select :model-value="settingsStore.language" class="lang-options" size="large" filterable
      @change="settingsStore.changeLanguage">
      <el-option v-for="item in langOptions" :key="item.value" :label="item.name" :value="item.value">
      </el-option>
    </el-select>

    <ul class="theme-options">
      <li :class="['theme-options-item', { 'selected': settingsStore.theme === theme.name }]"
        v-for="theme in themeOptions" :key="theme.name" @click="settingsStore.changeTheme(theme.name)">
        <el-icon :size="22">
          <component :is="theme.icon" />
        </el-icon>
        {{ theme.value() }}
      </li>
    </ul>

    <button class="start" @click="getStart">{{ t('get_start') }}</button>
  </div>
</template>

<script setup lang='ts'>
import { DefineComponent } from 'vue';
import { LocaleLang } from '../lang';
import { Moon, Platform, Sunny } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../store/useSettingsStore';

const settingsStore = useSettingsStore();

interface LangOption {
  name: string;
  value: LocaleLang
}

const langOptions: LangOption[] = [
  {
    name: "中文",
    value: LocaleLang.ZH
  },
  {
    name: "English",
    value: LocaleLang.EN
  }
]

const { t } = useI18n()


type Theme = 'auto' | 'dark' | 'light';

interface ThemeOption {
  name: Theme,
  icon: DefineComponent,
  value: (() => string)
}

const themeOptions = reactive<ThemeOption[]>([
  { name: 'auto', icon: markRaw(Platform), value: () => t('settings.system') },
  { name: 'light', icon: markRaw(Sunny), value: () => t('settings.light') },
  { name: 'dark', icon: markRaw(Moon), value: () => t('settings.dark') },
])

const splashScreen = ref<HTMLElement | null>(null)

const closeTime = 300;

const getStart = () => {
  // animation
  splashScreen.value!.style.transform = "scale(.3)"
  splashScreen.value!.style.opacity = "0"
  splashScreen.value!.style.borderRadius = "50%"
  setTimeout(() => {
    settingsStore.getStart();
  }, closeTime)
}

</script>

<style scoped>
.splash-screen {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background-color: saddlebrown;
  transform-origin: center;
  transition: all v-bind(closeTime + 'ms') ease-out;
}

.lang-options {
  background-color: transparent;
  border: 4px solid var(--primary);
  border-radius: 6px;
}

:deep(.lang-options .el-input),
:deep(.lang-options .el-input__wrapper) {
  background-color: var(--primary);
}

:deep(.lang-options .el-input__inner) {
  color: white;
  font-weight: 600;
  box-shadow: none !important;
}

:deep(.lang-options .el-input__inner:hover) {
  box-shadow: none !important;
}

.theme-options {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 0 auto;
  width: auto;
  gap: 20px;
}

.theme-options-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .2rem;
  padding: 1rem;
  border: 4px solid var(--primary);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all .3s ease-in-out;
}

.theme-options-item:hover,
.theme-options-item.selected {
  background-color: var(--primary);
  color: white;
}

.start {
  background-color: var(--primary);
  font-weight: 600;
  color: aliceblue;
  letter-spacing: 2px;
}
</style>

