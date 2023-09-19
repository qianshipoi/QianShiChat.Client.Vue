<template>
  <div class="main">
    <el-alert v-if="!chatStore.isReady" style="position: absolute; top:0" type="error" effect="dark" :closable="false"
      title="连接中断" show-icon />
    <el-container class="container">
      <el-container>
        <el-aside style="width: auto; background-color: var(--nav-bar-bg-color);">
          <div
            style="display: flex; height: 100%; flex-direction: column; align-items: center; justify-content: space-between;">
            <div>
              <el-image style="width: 40px;height: 40px;margin: 20px 0; border-radius: 50%;"
                :src="userStore.userInfo?.avatar" fit="cover" :lazy="true"></el-image>
              <nav-menu></nav-menu>
            </div>
            <el-space alignment="stretch" direction="vertical" style="width: 100%; outline: none;">

              <el-tooltip :content="t('nav.logout')" placement="right">
                <button @click="userStore.logout">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                </button>
              </el-tooltip>

              <el-tooltip :content="isCollapse ? t('nav.expand') : t('nav.close')" placement="right">
                <button @click="isCollapse = !isCollapse"><el-icon>
                    <Switch />
                  </el-icon></button>
              </el-tooltip>
            </el-space>
          </div>
        </el-aside>
        <el-main style="padding: 0;">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import NavMenu from '../components/NavMenu.vue';
import { useMenuStore } from '../store/useMenuStore'
import { useCurrentUserStore } from '../store/useCurrentUserStore';
import { useChatStore } from '../store/useChatStore';
import { useI18n } from 'vue-i18n';
import { useFriendStore } from '../store/useFriendStore';
import { SwitchButton, Switch } from '@element-plus/icons-vue'
import { useGroupStore } from '../store/useGroupStore';

const { t } = useI18n()

const menuStore = useMenuStore();
const { isCollapse } = storeToRefs(menuStore)
const userStore = useCurrentUserStore();
const chatStore = useChatStore();
chatStore.start();
const friendStore = useFriendStore();
friendStore.loadData();
const groupStore = useGroupStore();
groupStore.loadData();
</script>

<style scoped>
.main {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 1280px;
  min-width: 600px;
  background-color: var(--main-container-color);
  border-radius: 12px;
  overflow: hidden;
  height: 80vh;
}
</style>
