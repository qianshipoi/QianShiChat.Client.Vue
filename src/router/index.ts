import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from "vue-router";
import { useCurrentUserStore } from "../store/useCurrentUserStore";

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
      },
      {
        path: "/:pathMatch(.*)",
        redirect: "/home-404"
      },
      {
        name: "Home404",
        path: "home-404",
        component: () => import("../views/404.vue")
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
  const useStore = useCurrentUserStore()
  if (to.meta.authorization && !useStore.isAuthenticated && to.name !== "Login") {
    next(`/login?redirect=${from.path}`)
  }
  else {
    next()
  }
})

export default router
