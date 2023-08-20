import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from "vue-router";
import { useUserStore } from "../store/useUserStore";

const routes: RouteRecordRaw[] = [
  {
    name: "Home",
    path: "/",
    component: () => import("../views/Main.vue"),
    meta: {
      authorization: true,
    },
    redirect: "/",
    children: [
      {
        name: "Message",
        path: "/",
        component: () => import("../views/Message.vue")
      },
      {
        name: "Friend",
        path: "/friend",
        component: () => import("../views/Firend.vue")
      },
      {
        name: "Settings",
        path: "/settings",
        component: () => import("../views/Settings.vue")
      }
    ]
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("../views/Login.vue")
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach((to, from, next) => {
  const useStore = useUserStore()
  if (to.meta.authorization && !useStore.isAuthenticated && to.name !== "Login") {
    next(`/login?redirect=${from.path}`)
  }
  else {
    next()
  }
})

export default router
