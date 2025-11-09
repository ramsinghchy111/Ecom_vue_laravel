// src/store/modules/tasks.js
// import axiosClient from '@/axiosClient';

// export default {
//   namespaced: true,
//   state: () => ({
//     tasks: [],        // always an array
//     loading: false,
//     error: null
//   }),
//   getters: {
//     tasksByColumn: (state) => (column) => {
//       return Array.isArray(state.tasks) ? state.tasks.filter(t => t.column === column) : [];
//     },
//     totalTasks: (state) => {
//       return Array.isArray(state.tasks) ? state.tasks.length : 0;
//     }
//   },
//   mutations: {
//     SET_TASKS(state, tasks) {
//       if (Array.isArray(tasks)) {
//         state.tasks = tasks;
//       } else if (tasks && Array.isArray(tasks.data)) {
//         state.tasks = tasks.data;
//       } else if (tasks && Array.isArray(tasks.tasks)) {
//         state.tasks = tasks.tasks;
//       } else {
//         console.warn('SET_TASKS received non-array payload:', tasks);
//         state.tasks = [];
//       }
//     },
//     ADD_TASK(state, task) {
//       if (!Array.isArray(state.tasks)) state.tasks = [];
//       state.tasks.push(task);
//     },
//     UPDATE_TASK(state, task) {
//       if (!Array.isArray(state.tasks)) return;
//       const i = state.tasks.findIndex(t => t.id === task.id);
//       if (i !== -1) state.tasks.splice(i, 1, task);
//       else state.tasks.push(task); // graceful fallback
//     },
//     REMOVE_TASK(state, taskId) {
//       if (!Array.isArray(state.tasks)) return;
//       state.tasks = state.tasks.filter(t => t.id !== taskId);
//     },
//     SET_LOADING(state, v) { state.loading = v; },
//     SET_ERROR(state, e) { state.error = e; }
//   },
//   actions: {
//     async fetchTasks({ commit }) {
//       commit('SET_LOADING', true);
//       commit('SET_ERROR', null);
//       try {
//         const res = await axiosClient.get('/tasks');
//         // Try to normalize different API shapes:
//         if (Array.isArray(res.data)) commit('SET_TASKS', res.data);
//         else if (res.data && Array.isArray(res.data.data)) commit('SET_TASKS', res.data.data);
//         else if (res.data && Array.isArray(res.data.tasks)) commit('SET_TASKS', res.data.tasks);
//         else commit('SET_TASKS', res.data);
//       } catch (err) {
//         commit('SET_ERROR', err.response?.data?.message || err.message);
//         console.error('fetchTasks error', err);
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },
//     async createTask({ commit }, payload) {
//       commit('SET_ERROR', null);
//       try {
//         const { data } = await axiosClient.post('/tasks', payload);
//         // normalize returned data
//         const task = data && data.data ? data.data : data;
//         commit('ADD_TASK', task);
//         return task;
//       } catch (err) {
//         commit('SET_ERROR', err.response?.data?.message || err.message);
//         throw err;
//       }
//     },
//     async updateTask({ commit }, payload) {
//       commit('SET_ERROR', null);
//       try {
//         const { data } = await axiosClient.put(`/tasks/${payload.id}`, payload);
//         const task = data && data.data ? data.data : data;
//         commit('UPDATE_TASK', task);
//         return task;
//       } catch (err) {
//         commit('SET_ERROR', err.response?.data?.message || err.message);
//         throw err;
//       }
//     },
//         async deleteTask({ commit }, id) {
//       commit('SET_ERROR', null);
//       try {
//         const res = await axiosClient.delete(`/tasks/${id}`);
//         if (res.status === 200 || res.status === 204 || res.status === 202) {
//           commit('REMOVE_TASK', id);
//           return { ok: true, status: res.status };
//         }
//         const msg = `Unexpected delete status ${res.status}`;
//         commit('SET_ERROR', msg);
//         throw new Error(msg);
//       } catch (err) {
//         commit('SET_ERROR', err.response?.data?.message || err.message);
//         console.error('deleteTask error', err);
//         throw err;
//       }
//     }
//   }
// };

// src/store/modules/kanban.js

import axiosClient from '@/axiosClient';

export default {
  namespaced: true,
  state: () => ({
    columns: [],   // array of columns (each may include .cards)
    cards: [],     // flattened array of cards for easy lookup/filter
    loading: false,
    error: null
  }),

  getters: {
    // return columns array safely
    columnsList: (state) => Array.isArray(state.columns) ? state.columns : [],

    // return cards for a specific column id (accepts either number or string)
    cardsByColumn: (state) => (columnId) => {
      if (!Array.isArray(state.cards)) return [];
      // normalize compare as string to be flexible with types
      return state.cards.filter(c => String(c.column ?? c.column_id ?? c.columnId ?? '') === String(columnId));
    },

    // total cards count
    totalCards: (state) => Array.isArray(state.cards) ? state.cards.length : 0,

    // find card by id
    findCard: (state) => (id) => (Array.isArray(state.cards) ? state.cards.find(c => String(c.id) === String(id)) : undefined)
  },

  mutations: {
    SET_COLUMNS(state, columns) {
      if (Array.isArray(columns)) {
        state.columns = columns;
      } else if (columns && Array.isArray(columns.data)) {
        state.columns = columns.data;
      } else if (columns && Array.isArray(columns.columns)) {
        state.columns = columns.columns;
      } else {
        console.warn('SET_COLUMNS received non-array payload:', columns);
        state.columns = [];
      }
    },

    // Replace cards array (normalise possible shapes)
    SET_CARDS(state, cards) {
      if (Array.isArray(cards)) {
        state.cards = cards;
      } else if (cards && Array.isArray(cards.data)) {
        state.cards = cards.data;
      } else if (cards && Array.isArray(cards.cards)) {
        state.cards = cards.cards;
      } else {
        console.warn('SET_CARDS received non-array payload:', cards);
        state.cards = [];
      }
    },

    ADD_CARD(state, card) {
      if (!Array.isArray(state.cards)) state.cards = [];
      // ensure card has a column identifier (try multiple keys)
      if (!('column' in card) && ('column_id' in card)) card.column = card.column_id;
      state.cards.push(card);

      // also add to columns structure if present
      try {
        const colId = card.column ?? card.column_id ?? null;
        if (colId) {
          const col = state.columns.find(c => String(c.id) === String(colId));
          if (col) {
            if (!Array.isArray(col.cards)) col.cards = [];
            col.cards.push(card);
          }
        }
      } catch (e) {
        // non-fatal
      }
    },

    UPDATE_CARD(state, card) {
      if (!Array.isArray(state.cards)) state.cards = [];
      const idx = state.cards.findIndex(c => String(c.id) === String(card.id));
      if (idx !== -1) {
        // merge immutably
        state.cards.splice(idx, 1, { ...state.cards[idx], ...card });
      } else {
        // fallback: push if not found
        state.cards.push(card);
      }

      // also update card inside column if exists
      try {
        const colId = card.column ?? card.column_id ?? null;
        if (colId) {
          const col = state.columns.find(c => String(c.id) === String(colId));
          if (col && Array.isArray(col.cards)) {
            const i = col.cards.findIndex(cc => String(cc.id) === String(card.id));
            if (i !== -1) col.cards.splice(i, 1, { ...col.cards[i], ...card });
            else col.cards.push(card);
          }
        } else {
          // If column changed, remove from previous column(s) and add to correct one
          state.columns.forEach(c => {
            if (Array.isArray(c.cards)) {
              const i = c.cards.findIndex(cc => String(cc.id) === String(card.id));
              if (i !== -1) c.cards.splice(i, 1);
            }
          });
        }
      } catch (e) { /* ignore */ }
    },

    REMOVE_CARD(state, cardId) {
      if (!Array.isArray(state.cards)) state.cards = [];
      state.cards = state.cards.filter(c => String(c.id) !== String(cardId));

      // also remove from columns
      state.columns.forEach(col => {
        if (Array.isArray(col.cards)) {
          col.cards = col.cards.filter(c => String(c.id) !== String(cardId));
        }
      });
    },

    SET_LOADING(state, v) { state.loading = !!v; },
    SET_ERROR(state, e) { state.error = e ? (e.message || e) : null; }
  },

  actions: {
    // Fetch all columns (with cards) and normalize cards array
    async fetchColumns({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await axiosClient.get('/columns');

        // support different response shapes
        const payload = res.data;
        if (Array.isArray(payload)) {
          commit('SET_COLUMNS', payload);
          // extract cards from columns
          const cards = payload.flatMap(col => Array.isArray(col.cards) ? col.cards.map(card => ({ ...card, column: col.id })) : []);
          commit('SET_CARDS', cards);
        } else if (payload && Array.isArray(payload.data)) {
          commit('SET_COLUMNS', payload.data);
          const cards = payload.data.flatMap(col => Array.isArray(col.cards) ? col.cards.map(card => ({ ...card, column: col.id })) : []);
          commit('SET_CARDS', cards);
        } else {
          // fallback - try to set columns directly and empty cards
          commit('SET_COLUMNS', payload);
          commit('SET_CARDS', []);
        }
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message || err);
        console.error('fetchColumns error', err);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Fetch cards for a specific column or all cards if /cards exists
    async fetchCards({ commit }, columnId = null) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        let res;
        if (columnId) {
          res = await axiosClient.get(`/columns/${columnId}/cards`);
          // result likely an array of cards
          if (res && res.data) {
            // ensure each card carries the column id
            const cards = (Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : [])).map(c => ({ ...c, column: columnId }));
            commit('SET_CARDS', cards);
          } else commit('SET_CARDS', []);
        } else {
          // try fetching a global /cards endpoint if available
          res = await axiosClient.get('/cards').catch(() => null);
          if (res && res.data) {
            const cards = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
            commit('SET_CARDS', cards);
          } else {
            // fallback to fetching columns and extracting cards
            await this.dispatch('kanban/fetchColumns');
          }
        }
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message || err);
        console.error('fetchCards error', err);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // create card: payload expected to be the card data; if columnId provided, include in endpoint
    async createCard({ commit, dispatch }, { columnId, payload }) {
      commit('SET_ERROR', null);
      try {
        const res = await axiosClient.post(`/columns/${columnId}/cards`, payload);
        // normalize returned data (support {data: {...}} or {...})
        const data = res && res.data ? (res.data.data ? res.data.data : res.data) : null;
        const card = data || null;
        if (card) {
          // ensure column reference
          if (!('column' in card) && columnId) card.column = columnId;
          commit('ADD_CARD', card);
        } else {
          // as a fallback, refetch columns or cards
          await dispatch('fetchColumns');
        }
        return card;
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message || err);
        console.error('createCard error', err);
        throw err;
      }
    },

    // update card by id (payload must include id)
    async updateCard({ commit }, payload) {
      commit('SET_ERROR', null);
      try {
        if (!payload || !payload.id) throw new Error('updateCard requires payload.id');
        const res = await axiosClient.put(`/cards/${payload.id}`, payload);
        const data = res && res.data ? (res.data.data ? res.data.data : res.data) : null;
        const card = data || payload;
        commit('UPDATE_CARD', card);
        return card;
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message || err);
        console.error('updateCard error', err);
        throw err;
      }
    },

    // delete card by id
    async deleteCard({ commit }, id) {
      commit('SET_ERROR', null);
      try {
        const res = await axiosClient.delete(`/cards/${id}`);
        if (res.status === 200 || res.status === 204 || res.status === 202) {
          commit('REMOVE_CARD', id);
          return { ok: true, status: res.status };
        }
        const msg = `Unexpected delete status ${res.status}`;
        commit('SET_ERROR', msg);
        throw new Error(msg);
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message || err);
        console.error('deleteCard error', err);
        throw err;
      }
    }
  }
};
