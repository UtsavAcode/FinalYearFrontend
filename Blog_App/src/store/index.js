import { createStore } from "vuex";

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  mutations: {
    login(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  actions: {
    login({ commit }, user) {
      commit("login", user);
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    user: (state) => state.user,
    roles: (state) => (state.user ? state.user.roles : []),
  },
});

export default store;
