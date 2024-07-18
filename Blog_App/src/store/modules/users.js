import axios from "axios";

const state = {
  users: [],
  error: null,
};

const mutations = {
  set_users(state, users) {
    state.users = users;
  },
  users_error(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchUsers({ commit }) {
    try {
      const response = await axios.get("http://localhost:5254/api/Users");
      commit("set_users", response.data);
    } catch (error) {
      commit("users_error", error);
    }
  },
  async updateUser({ commit }, user) {
    try {
      await axios.put(`http://localhost:5254/api/Users/${user.id}`, user);
      commit(
        "set_users",
        state.users.map((u) => (u.id === user.id ? user : u))
      );
    } catch (error) {
      commit("users_error", error);
    }
  },
};

const getters = {
  users: (state) => state.users,
  usersError: (state) => state.error,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
