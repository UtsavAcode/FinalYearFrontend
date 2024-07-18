import axios from "axios";

const state = {
  token: localStorage.getItem("token") || "",
  user: {},
  status: "",
  error: null,
};

const mutations = {
  auth_request(state) {
    state.status = "loading";
    state.error = null;
  },
  auth_success(state, { token, user }) {
    state.token = token;
    state.user = user;
    state.status = "success";
    state.error = null;
  },
  auth_error(state, error) {
    state.status = "error";
    state.error = error;
  },
  logout(state) {
    state.status = "";
    state.token = "";
    state.user = {};
    state.error = null;
  },
};

const actions = {
  async login({ commit }, user) {
    commit("auth_request");
    try {
      const response = await axios.post(
        "http://localhost:5254/api/Auth/login",
        user
      );
      const token = response.data.token;
      const userResponse = await axios.get(
        "http://localhost:5254/api/Users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = userResponse.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      commit("auth_success", { token, user });
    } catch (error) {
      commit("auth_error", error);
      localStorage.removeItem("token");
    }
  },
  async register({ commit }, user) {
    commit("auth_request");
    try {
      await axios.post("http://localhost:5254/api/Auth/register", user);
      commit("auth_success", { token: "", user: {} });
    } catch (error) {
      commit("auth_error", error);
    }
  },
  logout({ commit }) {
    commit("logout");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  },
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.status,
  userRole: (state) => state.user.role,
  authError: (state) => state.error,
  user: (state) => state.user,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
