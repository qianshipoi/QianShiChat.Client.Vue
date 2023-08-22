import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import router from "../router";
import { useCurrentUserStore } from "../store/useCurrentUserStore";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

const instance = axios.create({
  baseURL: BASE_URL + "/api",
  timeout: 1000 * 60,
  headers: {
    "Client-Type": "VueClient"
  }
})

let loading: any;

let requestCount: number = 0;

const showLoading = () => {
  if (requestCount === 0) {
    loading = ElLoading.service({
      fullscreen: true,
      text: 'Loading  ',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  requestCount++;
}

const hideLoading = () => {
  requestCount--;
  if (requestCount === 0) {
    loading.close();
  }
}

instance.interceptors.request.use(config => {
  showLoading();

  const userStore = useCurrentUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }

  return config;
});

instance.interceptors.response.use(response => {
  hideLoading()

  const token = response.headers['x-access-token']
  if (token) {
    const userStore = useCurrentUserStore()
    userStore.token = token;
  }

  return response.data
}, error => {
  hideLoading()
  let message = ""
  if (error.response && error.response.status) {
    const status = error.response.status
    switch (status) {
      case 400:
        message = "bad request";
        break;
      case 401:
        message = "no authorization";
        if (router.currentRoute.value.name !== 'Login') {
          router.push({
            name: 'Login',
            query: {
              'redirect': router.currentRoute.value.path
            }
          })
        }
        break;
      case 404:
        message = "not found";
        break;
      case 408:
        message = "reqiest timeout";
        break;
      case 500:
        message = "server error";
        break;
      default:
        message = "request error";
        break;
    }

    ElMessage.error(message);
  }
  return Promise.reject(error)
})

export default instance
