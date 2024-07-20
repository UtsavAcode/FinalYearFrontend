// store/modules/auth.js
import authService from "@/services/auth.servics";

const state = {
  token: authService.getToken(),
  roles: authService.getRoles(), // Add roles to the state
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  CLEAR_TOKEN(state) {
    state.token = null;
  },
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  CLEAR_ROLES(state) {
    state.roles = [];
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    const response = await authService.login(email, password);
    if (response.isSuccess) {
      commit("SET_TOKEN", response.message);
      commit("SET_ROLES", response.roles);
      localStorage.setItem("token", response.message);
      localStorage.setItem("roles", JSON.stringify(response.roles));
    }
    return response;
  },
  logout({ commit }) {
    authService.logout();
    commit("CLEAR_TOKEN");
    commit("CLEAR_ROLES");
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  token: (state) => state.token,
  roles: (state) => state.roles, // Add roles getter
  isAdmin: (state) =>
    state.roles.includes("Admin") || state.roles.includes("SuperAdmin"),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
