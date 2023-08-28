<script setup lang="ts">
import { useLocaleStore } from './store/useLocaleStore';
import { useSettingsStore } from './store/useSettingsStore';
const settingsStore = useSettingsStore();
useLocaleStore();
</script>

<template>
  <RouterView />
  <SplashScreen v-if="settingsStore.isFirstTime" />
</template>
