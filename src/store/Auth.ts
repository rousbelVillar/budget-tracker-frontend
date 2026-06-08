import { defineStore } from "pinia";
import API from "../api";
import { getCookie } from "../globals/globals";

export interface User {
  id?: number;
  email: string;
  name: string;
  profile_image_url?: string;
}

export interface Login {
  emailUser: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isLoading: true,
    authenticated: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async fetchProfile() {
      this.error = null;
      const csrfToken = getCookie("csrf_access_token");
      try {
        const res = await API.get("/auth/profile", {
          headers: {
            "X-CSRF-TOKEN": csrfToken ?? "",
          },
          withCredentials: true,
        });
        this.user = res.data;
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch user";
      }
    },

    async login(loginInfo: Login) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await API.post(
          "/auth/login",
          {
            email: loginInfo.emailUser,
            password: loginInfo.password,
          },
          {
            withCredentials: true,
          },
        );
        this.user = res.data;
        this.authenticated = true;
        await this.fetchProfile();
        return true;
      } catch (err: any) {
        this.error = err.response?.data.message || "Login failed";
        this.authenticated = false;
      } finally {
        this.isLoading = false;
        this.authenticated = true;
      }
    },

    async register(user: User, password: string, profile_pic: any) {
      this.isLoading = true;
      this.error = null;

      try {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("password", password);
        if (profile_pic) {
          formData.append("profile_pic", profile_pic);
        }

        const res = await API.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.user = res.data;
        this.authenticated = true;
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Registration failed";
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
