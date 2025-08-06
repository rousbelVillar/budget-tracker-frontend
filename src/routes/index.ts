import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import AuthPage from "../components/AuthPage.vue";
import { useAuthStore } from "../store/Auth";
import { getCookie } from "../globals/globals";

export const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: { requiresAuth: true },
    component: Dashboard,
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.authenticated) {
    next("/auth");
  } else if (to.path === "/auth" && auth.authenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
