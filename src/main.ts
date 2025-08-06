import { createApp } from "vue";
import "./style.css";
import "primeicons/primeicons.css";
import "./assets/index.css";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import KeyFilter from "primevue/keyfilter";
import Aura from "@primeuix/themes/aura";
import { DialogService } from "primevue";
import { createPinia } from "pinia";
import router from "./routes";
import App from "./App.vue";

const app = createApp(App);
app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: false,
      cssLayer: false,
    },
  },
});
app.directive("keyfilter", KeyFilter);
app.use(createPinia());
app.use(DialogService);
app.use(ToastService);
app.use(ConfirmationService);
app.use(router).mount("#app");
