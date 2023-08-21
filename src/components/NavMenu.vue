<template>
  <el-menu :background-color="navBackGroundColor" router :default-active="defaultActive" class="el-menu-vertical-demo"
    :collapse="isCollapse">
    <el-menu-item index="/">
      <el-icon><icon-menu /></el-icon>
      <template #title>mesages</template>
    </el-menu-item>
    <el-menu-item index="/friend">
      <el-icon>
        <document />
      </el-icon>
      <template #title>friends</template>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon>
        <setting />
      </el-icon>
      <template #title>settings</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang='ts'>
import {
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
import { useCssVar } from '@vueuse/core'
import { useMenuStore } from '../store/useMenuStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();
const menuStore = useMenuStore();
const { isCollapse } = storeToRefs(menuStore)
const defaultActive = ref<string>('/')

const el = ref<any>()

const navBackGroundColor = useCssVar('--nav-bar-background-color', el);


onMounted(() => {
  defaultActive.value = route.path
})


</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-vertical-demo {

  border-right-width: 0;
}
</style>
