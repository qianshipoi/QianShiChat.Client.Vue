<template>
  <div class="settings">
    <el-select :model-value="settingsStore.language" popper-class="language-select-popper" class="lang-options"
      size="large" filterable @change="settingsStore.changeLanguage">
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
  </div>
</template>

<script setup lang='ts'>
import { DefineComponent } from 'vue';
import { LocaleLang } from '../lang';
import { useSettingsStore } from '../store/useSettingsStore';
import { Moon, Platform, Sunny } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';

const settingsStore = useSettingsStore();
const { t } = useI18n()
type Theme = 'auto' | 'dark' | 'light';

interface LangOption {
  name: string;
  value: LocaleLang
}

interface ThemeOption {
  name: Theme,
  icon: DefineComponent,
  value: (() => string)
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

const themeOptions = reactive<ThemeOption[]>([
  { name: 'auto', icon: markRaw(Platform), value: () => t('settings.system') },
  { name: 'light', icon: markRaw(Sunny), value: () => t('settings.light') },
  { name: 'dark', icon: markRaw(Moon), value: () => t('settings.dark') },
])

</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
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
  transition: all .3s ease-in-out;
  cursor: pointer;
}

.theme-options-item:hover,
.theme-options-item.selected {
  background-color: var(--primary);
  color: white;
}
</style>

<style>
.language-select-popper {
  --el-bg-color-overlay: var(--primary);
  --el-color-primary: var(--el-text-color-primary);
  --el-border-color-light: var(--primary);
}
</style>
