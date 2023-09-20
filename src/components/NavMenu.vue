<template>
  <el-menu router :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="isCollapse">
    <el-menu-item index="/">
      <el-icon>
        <ChatLineSquare />
      </el-icon>
      <template #title>{{ t('nav.messages') }}</template>
    </el-menu-item>
    <el-menu-item index="/friend">
      <el-icon>
        <UserFilled />
      </el-icon>
      <template #title>{{ t('nav.firends') }}</template>
    </el-menu-item>
    <el-menu-item index="/found">
      <el-icon>
        <Search />
      </el-icon>
      <template #title>{{ t('nav.found') }}</template>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon>
        <setting />
      </el-icon>
      <template #title>{{ t('nav.settings') }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang='ts'>
import {
  UserFilled,
  ChatLineSquare,
  Setting,
  Search,
} from '@element-plus/icons-vue'
import { useMenuStore } from '../store/useMenuStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const route = useRoute();
const menuStore = useMenuStore();
const { isCollapse } = storeToRefs(menuStore)
const defaultActive = ref<string>('/')

watchEffect(() => {
  defaultActive.value = route.path
})

</script>

<style scoped>
.el-menu-vertical-demo {
  --el-menu-bg-color: var(--nav-bar-bg-color);
  --el-menu-text-color: var(--text-color-primary);
  --el-menu-active-color: var(--item-active-color);
  border-right-width: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
