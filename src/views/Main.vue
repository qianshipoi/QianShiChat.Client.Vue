<template>
  <router-link v-for="item in navs" :key="item.name" :to="item.path">{{ item.name }}</router-link>
  <router-view />
</template>

<script setup lang='ts'>
import { reactive } from 'vue';

interface NavOption {
  name: string
  path: string

}
const navs = reactive<NavOption[]>([])

</script>

<style>
</style>
