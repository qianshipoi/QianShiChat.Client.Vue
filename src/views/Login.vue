<template>
  <div class="login">
    <div class="wrapper">
      <div class="card-switch">
        <comic-flip-card v-model="isRegister">
          <template #front>
            <div class="title">Log in</div>
            <form class="flip-card__form" action="">
              <comic-input v-model="baseInfo.account" name="email" placeholder="Email" type="email"></comic-input>
              <comic-input v-model="baseInfo.password" name="password" placeholder="Password"
                type="password"></comic-input>
              <comic-button @click="loginHandle">Let`s go!</comic-button>
            </form>
          </template>
          <template #back>
            <div class="title">Sign up</div>
            <form class="flip-card__form" action="">
              <img v-if="avatarPath" :src="avatarPath" @click.prevent="avatarDrawer = true" alt="">
              <comic-input v-model="registerForm.nickName" name="nickName" placeholder="NickName"
                type="text"></comic-input>
              <comic-input v-model="registerForm.account" name="account" placeholder="Account" type="name"></comic-input>
              <comic-input v-model="registerForm.password" name="password" placeholder="Password"
                type="password"></comic-input>
              <comic-button @click="registerHandle">Confirm!</comic-button>
            </form>
          </template>
        </comic-flip-card>
      </div>
    </div>

    <div class="loading" v-if="loading">
      <img src="https://chat-api.kuriyama.top/Raw/DefaultAvatar/12.gif" alt="loading">
      <span style="color: white; font-size:larger; font-weight: bold;"> Loading...</span>
    </div>

    <el-drawer :size="300" v-model="avatarDrawer" title="Select your avatar" direction="rtl">
      <div>
        <ul class="default-avatar-list">
          <li @click="avatarSelected(avatar)" v-for="avatar in defaultAvatars" :key="avatar.id">
            <img :src="avatar.path" :alt="avatar.path">
          </li>
        </ul>
      </div>
    </el-drawer>

    <span>style from: <el-link type="primary" href="https://uiverse.io/andrew-demchenk0/afraid-cougar-9"
        target="_blank">uiverse.io</el-link>
    </span>
  </div>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { LoginParams, useCurrentUserStore } from '../store/useCurrentUserStore';
import { defaults } from '../api/avatar';
import { Avatar } from '../types/Types';
import { RegisterRequest } from '../api/user';
import { register } from '../api/user';
import ComicInput from '../components/Uiverse/ComicInput.vue';

const route = useRoute()
const router = useRouter()
const defaultAvatars = ref<Avatar[]>([]);
const avatarDrawer = ref(false);
const loading = ref(false)
const isRegister = ref(false)

const baseInfo = reactive<LoginParams>({
  account: 'admin',
  password: '123456'
})

const userStore = useCurrentUserStore();

const avatarPath = computed(() => {
  const avatar = defaultAvatars.value.find(item => item.id === registerForm.defaultAvatarId);
  return avatar?.path ?? '';
})

const registerForm: RegisterRequest = reactive({
  account: '',
  password: '',
  nickName: '',
  defaultAvatarId: 1
});

(function () {
  defaults(100).then(({ succeeded, data, errors }) => {
    if (succeeded) {
      defaultAvatars.value = data?.items ?? [];
    } else {
      ElNotification.error(errors as string);
    }
  })
})()

const avatarSelected = (avatar: Avatar) => {
  registerForm.defaultAvatarId = avatar.id;
  avatarDrawer.value = false;
}

const registerHandle = async () => {
  if (loading.value) return;

  if (registerForm.account === '' || registerForm.password === '' || registerForm.nickName === '') {
    return ElMessage.warning('please fill in the form.')
  }

  loading.value = true;
  try {
    const { succeeded, data, errors } = await register(registerForm);
    if (!succeeded)
      return ElNotification.error(errors as string);
    ElMessage.success('register succeeded.')
    baseInfo.account = data?.account ?? '';
    isRegister.value = false;
  } catch (error) {
    ElNotification.error(error as string);
  } finally {
    loading.value = false;
  }
}

const loginHandle = async () => {
  if (!baseInfo.account || !baseInfo.password) return;
  const result = await userStore.login(baseInfo)
  if (!result) {
    return;
  }

  ElMessage.success('login succeeded.')
  // redirect
  const redirectUrl = route.query['redirect'] as string
  if (redirectUrl) {
    router.push(redirectUrl);
  } else {
    router.push({ name: 'Home' })
  }
}

</script>

<style lang="css">
@import url(../assets/css/comicGlobal.css);
</style>

<style lang="scss" scoped>
.login {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #DBDBFF;

  &>span {
    position: absolute;
    bottom: 1rem;
  }
}

.login-main {
  position: relative;
  display: flex;
  width: 800px;
  height: 600px;
  background-color: #FFFFFF;
  box-shadow: 0 0 6px rgba(255, 255, 255, .4);
  padding: 1rem;
  border-radius: 2rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flip-card__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.flip-card__form>img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 4px 4px var(--comic-main-color);
  cursor: pointer;
}

.title {
  margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--comic-main-color);
}

.default-avatar-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  &>li {
    display: block;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 4px 4px var(--comic-main-color);

    &>img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .5);
  z-index: 999;

  &>img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 4px 4px var(--comic-main-color);
  }
}
</style>
