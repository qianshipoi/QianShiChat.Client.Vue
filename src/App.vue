<script setup lang="ts">
import { useSettingsStore } from './store/useSettingsStore';
const settingsStore = useSettingsStore();
</script>

<template>
  <RouterView />
  <SplashScreen v-if="settingsStore.isFirstTime" />
</template>
