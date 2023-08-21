<template>
  <el-container class="main">
    <el-header>

    </el-header>
    <el-container>
      <el-aside style="width: auto; background-color: var(--nav-bar-background-color);">
        <div
          style="display: flex; height: 100%; flex-direction: column; align-items: center; justify-content: space-between;">
          <nav-menu></nav-menu>
          <el-space alignment="stretch" direction="vertical" style="width: 100%; outline: none;">
            <button @click="userStore.logout">登出</button>
            <button @click="isCollapse = !isCollapse">{{ isCollapse ? '展开' : '收起' }}</button>
          </el-space>
        </div>
      </el-aside>
      <el-main style="padding: 0;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import NavMenu from '../components/NavMenu.vue';
import { useMenuStore } from '../store/useMenuStore'
import { useUserStore } from '../store/useUserStore'

const menuStore = useMenuStore();
const { isCollapse } = storeToRefs(menuStore)

const userStore = useUserStore();

</script>

<style scoped>
.main {
  max-width: 1280px;
  margin: 60px auto;
  min-width: 600px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  height: 80vh;
}
</style>
