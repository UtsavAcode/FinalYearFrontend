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

// Import Toastr
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // Import Toastr CSS

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
  LineController,
} from "chart.js";

// Import the new plugins for exporting files
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

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
  LineController
);

import axios from "axios";
import VueFroala from "vue-froala-wysiwyg";
app.config.globalProperties.hostname = "http://localhost:5254";

// Set up Toastr options
toastr.options = {
  positionClass: "toast-top-right", // Position of the toast
  timeOut: 3000, // Auto close after 3 seconds
  closeButton: true, // Show close button
  progressBar: true, // Show progress bar
};

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
app.config.globalProperties.$toastr = toastr; // Make Toastr available globally

// Make the new plugins globally available in the app
app.config.globalProperties.$html2canvas = html2canvas;
app.config.globalProperties.$jsPDF = jsPDF;
app.config.globalProperties.$saveAs = saveAs;
app.config.globalProperties.$docx = { Document, Packer, Paragraph, TextRun };

app.use(router);
app.use(VueFroala);
app.use(store);
app.use(bootstrap);
app.mount("#app");
