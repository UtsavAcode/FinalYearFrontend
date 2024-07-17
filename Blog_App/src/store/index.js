// src/store/index.js

import { createApp } from "vue";
import { createStore } from "vuex";
import auth from "/src/store/modules/auth.js";

const store = createStore({
  modules: {
    auth,
  },
});

export default store;
