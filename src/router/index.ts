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
        component: () => import("../views/Message.vue"),
      },
      {
        name: "Friend",
        path: "/friend",
        component: () => import("../views/Friend.vue"),
        children: [
          {
            name: "FriendApply",
            path: "/friend/new-friends",
            component: () => import("../views/friend/FriendApply.vue"),
          },
          {
            name: "GroupApply",
            path: "/friend/new-groups",
            component: () => import("../views/friend/GroupApply.vue"),
          },
          {
            name: "FriendProfile",
            path: "/friend/friends/:id",
            component: () => import("../views/friend/UserProfile.vue"),
          }, {
            name: "GroupProfile",
            path: "/friend/groups/:id",
            component: () => import("../views/friend/GroupProfile.vue"),
          }
        ]
      },
      {
        name: "Settings",
        path: "/settings",
        component: () => import("../views/Settings.vue")
      },
      {
        name: "Found",
        path: "/found",
        component: () => import("../views/Found.vue")
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
  },
  {
    name: "Demo",
    path: "/demo",
    component: () => import("../views/Demo.vue")
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
