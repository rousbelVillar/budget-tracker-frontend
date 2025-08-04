import { defineStore } from "pinia";
import API from "../api";
import { getCookie } from "../globals/globals";

API.defaults.withCredentials = true;

interface User {
  id: number;
  email: string;
  name: string;
}

interface Login {
  emailUser: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isLoading: false,
    authenticated: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async fetchProfile() {
      this.isLoading = true;
      this.error = null;
      const csrfToken = getCookie("csrf_access_token");
      try {
        const res = await API.get(
          "/auth/profile",
          {
            withCredentials: true,
          },
          {
            headers: {
              "X-CSRF-TOKEN": csrfToken ?? "",
            },
          }
        );
        this.user = res.data;
        this.authenticated = true;
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch user";
      } finally {
        this.isLoading = false;
      }
    },

    async login(loginInfo: Login) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await API.post("/auth/login", {
          email: loginInfo.emailUser,
          password: loginInfo.password,
        });
        this.user = res.data;
        this.authenticated = true;
        await this.fetchProfile();
        return true;
      } catch (err: any) {
        this.error = err.response?.data.message || "Login failed";
        this.authenticated = false;
      } finally {
        this.isLoading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const res = await API.post(
          "/auth/register",
          { name, email, password },
          { withCredentials: true }
        );
        this.user = res.data;
        this.authenticated = true;
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Logout failed";
        this.authenticated = false;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;
      this.error = null;

      try {
        await API.post("/auth/logout", {}, { withCredentials: true });
        this.authenticated = false;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Logout failed";
      } finally {
        this.isLoading = false;
        this.user = null;
        this.error = null;
      }
    },
  },
});
