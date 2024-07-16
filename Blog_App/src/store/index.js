import { createStore } from "vuex";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5103/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.user = null;
      state.token = "";
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  actions: {
    async register({ commit }, user) {
      try {
        await apiClient.post("/Auth/Register", user);
      } catch (error) {
        throw new Error(error.response.data.message || "Registration failed.");
      }
    },
    async login({ commit }, credentials) {
      try {
        const response = await apiClient.post("/Auth/Login", credentials);
        commit("setUser", response.data.user);
        commit("setToken", response.data.token);
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      } catch (error) {
        throw new Error(error.response.data.message || "Login failed.");
      }
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    user: (state) => state.user,
  },
});

export default store;
