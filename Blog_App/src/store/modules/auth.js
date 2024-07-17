// src/store/modules/auth.js

import axios from "axios";

export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
    roles: [],
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.roles = [];
    },
  },
  actions: {
    async register({ commit }, user) {
      try {
        const response = await axios.post("/api/auth/register", user);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    async login({ commit }, user) {
      try {
        const response = await axios.post("/api/auth/login", user);
        commit("SET_USER", response.data.user);
        commit("SET_TOKEN", response.data.jwtToken);
        commit("SET_ROLES", response.data.roles);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get("/api/auth/users");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    async updateUser({ commit }, user) {
      try {
        const response = await axios.put("/api/auth/updateUser", user);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    async deleteUser({ commit }, userId) {
      try {
        const response = await axios.delete(`/api/auth/deleteUser/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getRoles: (state) => state.roles,
  },
};
