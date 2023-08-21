<template>
  <div class="room">
    <header>
      <span>张三</span>
      <div class="menu">
        <el-icon>
          <MoreFilled />
        </el-icon>
      </div>
    </header>
    <div style="position: relative; flex: 1;">
      <div id="wrapper">
        <div id="container">
          <div id="sidebar">
            <p>Sidebar content</p>
          </div>
          <div id="resizer"></div>
          <div id="main">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { MoreFilled } from '@element-plus/icons-vue'
import { useLocalStorage } from '@vueuse/core';
const currentSplitPosition = useLocalStorage('message_content_split_position', '72%')
const MESSAGE_CONTENT_MIN_HEIGHT = 300

onMounted(() => {
  const wrapper = document.querySelector("#wrapper") as HTMLElement;
  const resizer = document.querySelector("#resizer") as HTMLElement;
  const sidebar = document.querySelector("#sidebar") as HTMLElement;

  const offsetTop = wrapper.getBoundingClientRect().top;

  resizer.addEventListener("mousedown", () => {
    document.addEventListener("mousemove", resize, false);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", resize, false);
    }, false);
  });

  function resize(e: MouseEvent) {
    let offset = e.y - offsetTop
    if (offset < MESSAGE_CONTENT_MIN_HEIGHT) {
      offset = MESSAGE_CONTENT_MIN_HEIGHT;
    }

    const size = `${offset}px`;
    sidebar.style.flexBasis = size;
    currentSplitPosition.value = size;
  }

  sidebar.style.flexBasis = currentSplitPosition.value;
})


</script>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 18px;
  height: 68px;
  border-bottom: 1px solid #E9E9E9;
}

.menu>.el-icon {
  cursor: pointer;
  font-size: 26px;
  padding: 4px;
}

.menu>.el-icon:hover {
  color: var(--primary);
}

#wrapper {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0;
  padding: 0;
}

#container {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#sidebar {
  height: 100%;
  position: relative;
  min-height: 0;
}

#resizer {
  flex-basis: 2px;
  background-color: #E9E9E9;
  position: relative;
  z-index: 2;
  cursor: row-resize;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#main {
  flex-basis: 0;
  flex-grow: 1;
  min-height: 140px;

  background: lightblue;
  height: 100%;
  flex-direction: row;
  position: relative;
  display: flex;
  margin: 0;
  padding: 0;
}
</style>
