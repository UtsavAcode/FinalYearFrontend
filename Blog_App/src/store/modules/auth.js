import authService from "@/services/auth.servics";

const state = {
  token: authService.getToken(),
  roles: authService.getRoles(),
  name: authService.getName(),
  id: authService.getId(),
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
  SET_NAME(state, name) {
    state.name = name;
  },

  CLEAR_NAME(state) {
    state.name = "";
  },
  SET_ID(state, id) {
    state.id = id;
  },
  CLEAR_ID(state) {
    state.id = null;
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    const response = await authService.login(email, password);
    if (response.isSuccess) {
      commit("SET_TOKEN", response.message);
      commit("SET_ROLES", response.roles);
      commit("SET_NAME", response.name);
      commit("SET_ID", response.id);
      localStorage.setItem("token", response.message);
      localStorage.setItem("roles", JSON.stringify(response.roles));
      localStorage.setItem("name", response.name);
      localStorage.setItem("id", JSON.stringify(response.id));
    }
    return response;
  },
  logout({ commit }) {
    authService.logout();
    commit("CLEAR_TOKEN");
    commit("CLEAR_ROLES");
    commit("CLEAR_NAME");
    commit("CLEAR_ID");
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  token: (state) => state.token,
  roles: (state) => state.roles,
  name: (state) => state.name,
  id: (state) => {
    console.log("Retrieved ID from state:", state.id); // Debugging
    return state.id;
  },
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
