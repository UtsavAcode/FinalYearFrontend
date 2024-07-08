import { createApp } from "vue";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import router from "./router";

import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";



const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component("IconField", IconField);
app.component("InputText", InputText);
app.component("InputIcon", InputIcon);

app.mount("#app");
