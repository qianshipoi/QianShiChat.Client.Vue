import { defineStore } from "pinia";

export const useMenuStore = defineStore('menu', () => {
  const isCollapse = ref<boolean>(false);
  return {
    isCollapse
  }
}, {
  persist: {
    paths: ["isCollapse"]
  }
})
