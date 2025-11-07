// src/store/modules/tasks.js
import axiosClient from '@/axiosClient';

export default {
  namespaced: true,
  state: () => ({
    tasks: [],        // always an array
    loading: false,
    error: null
  }),
  getters: {
    tasksByColumn: (state) => (column) => {
      return Array.isArray(state.tasks) ? state.tasks.filter(t => t.column === column) : [];
    },
    totalTasks: (state) => {
      return Array.isArray(state.tasks) ? state.tasks.length : 0;
    }
  },
  mutations: {
    SET_TASKS(state, tasks) {
      if (Array.isArray(tasks)) {
        state.tasks = tasks;
      } else if (tasks && Array.isArray(tasks.data)) {
        state.tasks = tasks.data;
      } else if (tasks && Array.isArray(tasks.tasks)) {
        state.tasks = tasks.tasks;
      } else {
        console.warn('SET_TASKS received non-array payload:', tasks);
        state.tasks = [];
      }
    },
    ADD_TASK(state, task) {
      if (!Array.isArray(state.tasks)) state.tasks = [];
      state.tasks.push(task);
    },
    UPDATE_TASK(state, task) {
      if (!Array.isArray(state.tasks)) return;
      const i = state.tasks.findIndex(t => t.id === task.id);
      if (i !== -1) state.tasks.splice(i, 1, task);
      else state.tasks.push(task); // graceful fallback
    },
    REMOVE_TASK(state, taskId) {
      if (!Array.isArray(state.tasks)) return;
      state.tasks = state.tasks.filter(t => t.id !== taskId);
    },
    SET_LOADING(state, v) { state.loading = v; },
    SET_ERROR(state, e) { state.error = e; }
  },
  actions: {
    async fetchTasks({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await axiosClient.get('/tasks');
        // Try to normalize different API shapes:
        if (Array.isArray(res.data)) commit('SET_TASKS', res.data);
        else if (res.data && Array.isArray(res.data.data)) commit('SET_TASKS', res.data.data);
        else if (res.data && Array.isArray(res.data.tasks)) commit('SET_TASKS', res.data.tasks);
        else commit('SET_TASKS', res.data);
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message);
        console.error('fetchTasks error', err);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createTask({ commit }, payload) {
      commit('SET_ERROR', null);
      try {
        const { data } = await axiosClient.post('/tasks', payload);
        // normalize returned data
        const task = data && data.data ? data.data : data;
        commit('ADD_TASK', task);
        return task;
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message);
        throw err;
      }
    },
    async updateTask({ commit }, payload) {
      commit('SET_ERROR', null);
      try {
        const { data } = await axiosClient.put(`/tasks/${payload.id}`, payload);
        const task = data && data.data ? data.data : data;
        commit('UPDATE_TASK', task);
        return task;
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message);
        throw err;
      }
    },
        async deleteTask({ commit }, id) {
      commit('SET_ERROR', null);
      try {
        const res = await axiosClient.delete(`/tasks/${id}`);
        if (res.status === 200 || res.status === 204 || res.status === 202) {
          commit('REMOVE_TASK', id);
          return { ok: true, status: res.status };
        }
        const msg = `Unexpected delete status ${res.status}`;
        commit('SET_ERROR', msg);
        throw new Error(msg);
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message);
        console.error('deleteTask error', err);
        throw err;
      }
    }
  }
};
