import "./assets/app.css";
import store from "./store";

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
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar";

import Panel from "primevue/panel";
import "froala-editor/js/plugins.pkgd.min.js";
// Import third-party plugins
import "froala-editor/js/third_party/embedly.min";
import "froala-editor/js/third_party/font_awesome.min";
import "froala-editor/js/third_party/spell_checker.min";
import "froala-editor/js/third_party/image_tui.min";
// Import Froala Editor CSS files.
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

// Import Chart.js components
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController, // Import LineController
} from "chart.js";

const app = createApp(App);

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController // Register LineController here
);

import axios from "axios";
import VueFroala from "vue-froala-wysiwyg";
app.config.globalProperties.hostname = "http://localhost:5254";

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
app.component("Panel", Panel);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("InputIcon", InputIcon);
app.component("InputText", InputText);
app.component("MultiSelect", MultiSelect);
app.component("Calendar", Calendar);

app.config.globalProperties.$axios = axios;
app.use(router);
app.use(VueFroala);
app.use(store);
app.use(bootstrap);
app.mount("#app");
