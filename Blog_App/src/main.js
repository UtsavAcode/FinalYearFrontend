import "./assets/app.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import IconField from "primevue/iconfield";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import "primeicons/primeicons.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: ".dark ",
      cssLayer: false,
    },
  },
});

app.component("IconField", IconField);
app.component("InputIcon", InputIcon);
app.component("InputText", InputText);

app.use(router);
app.use(bootstrap);
app.mount("#app");
