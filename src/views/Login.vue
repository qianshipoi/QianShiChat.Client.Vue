<template>
  <div class="login">
    <div class="wrapper">
      <div class="card-switch">
        <label class="switch">
          <input type="checkbox" v-model="isRegister" class="toggle">
          <span class="slider"></span>
          <span class="card-side"></span>
          <div class="flip-card__inner">
            <div class="flip-card__front">
              <div class="title">Log in</div>
              <form class="flip-card__form" action="">
                <input class="flip-card__input" v-model="baseInfo.account" name="email" placeholder="Email" type="email">
                <input class="flip-card__input" v-model="baseInfo.password" name="password" placeholder="Password"
                  type="password">
                <button type="button" @click="onSubmit" class="flip-card__btn">Let`s go!</button>
              </form>
            </div>
            <div class="flip-card__back">
              <div class="title">Sign up</div>
              <form class="flip-card__form" action="">
                <img v-if="avatarPath" :src="avatarPath" @click.prevent="avatarDrawer = true" alt="">
                <input class="flip-card__input" name="nickName" placeholder="NickName" v-model="registerForm.nickName"
                  type="text">
                <input class="flip-card__input" placeholder="Account" v-model="registerForm.account" type="name">
                <input class="flip-card__input" name="password" placeholder="Password" type="password"
                  v-model="registerForm.password">
                <button class="flip-card__btn" type="button" @click="registerHandle">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>

    <el-drawer v-model="avatarDrawer" title="Select your avatar" direction="rtl">
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
import { useCurrentUserStore } from '../store/useCurrentUserStore';
import { defaults } from '../api/avatar';
import { Avatar } from '../types/Types';
import { RegisterRequest } from '../api/user';
import { register } from '../api/user';

interface BaseInfo {
  account: string
  password: string
}

const route = useRoute()
const router = useRouter()
const isRegister = ref(false)

const baseInfo = reactive<BaseInfo>({
  account: 'admin',
  password: '123456'
})

const userStore = useCurrentUserStore();

const defaultAvatars = ref<Avatar[]>([]);
const avatarDrawer = ref(false);
const loading = ref(false)

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

  if(registerForm.account === '' || registerForm.password === '' || registerForm.nickName === '') {
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

const onSubmit = async () => {
  if (!baseInfo.account || !baseInfo.password) return;
  const result = await userStore.login(baseInfo.account, baseInfo.password)
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

<style lang="scss" scoped>
.login {
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --bg-color-alt: #666;
  --main-color: #323232;
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

/* switch card */
.switch {
  transform: translateY(-200px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  width: 50px;
  height: 20px;
}

.card-side::before {
  position: absolute;
  content: 'Log in';
  left: -70px;
  top: 0;
  width: 100px;
  text-decoration: underline;
  color: var(--font-color);
  font-weight: 600;
}

.card-side::after {
  position: absolute;
  content: 'Sign up';
  left: 70px;
  top: 0;
  width: 100px;
  text-decoration: none;
  color: var(--font-color);
  font-weight: 600;
}

.toggle {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  box-sizing: border-box;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-colorcolor);
  transition: 0.3s;
}

.slider:before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  border: 2px solid var(--main-color);
  border-radius: 5px;
  left: -2px;
  bottom: 2px;
  background-color: var(--bg-color);
  box-shadow: 0 3px 0 var(--main-color);
  transition: 0.3s;
}

.toggle:checked+.slider {
  background-color: var(--input-focus);
}

.toggle:checked+.slider:before {
  transform: translateX(30px);
}

.toggle:checked~.card-side:before {
  text-decoration: none;
}

.toggle:checked~.card-side:after {
  text-decoration: underline;
}

/* card */

.flip-card__inner {
  width: 300px;
  height: 350px;
  position: relative;
  background-color: transparent;
  perspective: 1000px;
  /* width: 100%;
    height: 100%; */
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.toggle:checked~.flip-card__inner {
  transform: rotateY(180deg);
}

.toggle:checked~.flip-card__front {
  box-shadow: none;
}

.flip-card__front,
.flip-card__back {
  padding: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background: lightgrey;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.flip-card__back {
  width: 100%;
  transform: rotateY(180deg);
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
  box-shadow: 4px 4px var(--main-color);
  cursor: pointer;
}

.title {
  margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--main-color);
}

.flip-card__input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.flip-card__input::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

.flip-card__input:focus {
  border: 2px solid var(--input-focus);
}

.flip-card__btn:active,
.button-confirm:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.flip-card__btn {
  margin: 20px 0 20px 0;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}

.default-avatar-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  &>li {
    display: block;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 4px 4px var(--main-color);

    &>img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
