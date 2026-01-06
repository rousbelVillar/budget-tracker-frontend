import { defineStore } from "pinia";
import { Category } from "../interfaces/Category";
import API from "../api";
import { getCookie } from "../globals/globals";

export const useCategorieStore = defineStore("categories", {
  state: () => ({
    categories: [] as Category[],
    error: "" as string | null,
    loading: false as boolean,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      const res = await API.get("/categories/get");
      this.categories = res.data.map((c: any) => {
        const category: Category = {
          name: c.name,
          icon: c.icon,
          is_default: c.is_default,
          optionAndIcon: c.icon + " " + c.name,
        };
        return category;
      });
      return this.categories;
    },

    async addCategory(newCategory: Category) {
      const csrfToken = getCookie("csrf_access_token");
      const res = await API.post(
        "/categories/add",
        { params: newCategory },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken ?? "",
          },
        }
      );
    },
  },
});
