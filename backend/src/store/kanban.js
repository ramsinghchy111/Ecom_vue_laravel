// store/kanban.js
import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    columns: [],    // each column: { id, name, position, cards: [...] }
    loading: false,
    error: null
  }),

  getters: {
    // sorted columns
    getColumns(state) {
      return state.columns.slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    },
    getColumnById: (state) => (id) => state.columns.find(c => c.id === id)
  },

  mutations: {
    setColumns(state, columns) {
      if (!Array.isArray(columns)) {
        console.warn('setColumns received non-array:', columns)
        state.columns = []
        return
      }
      state.columns = columns
        .map(c => ({
          ...c,
          cards: Array.isArray(c.cards)
            ? c.cards.slice().sort((x, y) => (x.position ?? 0) - (y.position ?? 0))
            : []
        }))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    },

    setLoading(state, v) { state.loading = v },
    setError(state, e) { state.error = e },

    addCard(state, { columnId, card }) {
      const col = state.columns.find(c => c.id === columnId)
      if (col) col.cards.push(card)
    },

    upsertCard(state, card) {
      // remove existing card from any column
      state.columns.forEach(col => {
        const idx = col.cards.findIndex(c => c.id === card.id)
        if (idx !== -1) col.cards.splice(idx, 1)
      })
      // insert into target column
      const toCol = state.columns.find(c => c.id === card.column_id)
      if (toCol) {
        const pos = (card.position !== undefined && card.position !== null) ? card.position : toCol.cards.length
        toCol.cards.splice(pos, 0, card)
      }
    },

    moveCardLocally(state, { cardId, fromColumnId, toColumnId, toIndex }) {
      // find and remove card from source
      let card = null
      if (fromColumnId != null) {
        const fromCol = state.columns.find(c => c.id === fromColumnId)
        if (fromCol) {
          const idx = fromCol.cards.findIndex(c => c.id === cardId)
          if (idx !== -1) {
            card = fromCol.cards.splice(idx, 1)[0]
          }
        }
      }

      // fallback search
      if (!card) {
        for (const c of state.columns) {
          const idx = c.cards.findIndex(cc => cc.id === cardId)
          if (idx !== -1) {
            card = c.cards.splice(idx, 1)[0]
            break
          }
        }
      }

      // placeholder if still not found
      if (!card) {
        card = { id: cardId, title: 'Untitled', description: '', column_id: toColumnId }
      }

      const destCol = state.columns.find(c => c.id === toColumnId)
      if (!destCol) {
        if (state.columns.length) state.columns[0].cards.push(card)
        return
      }

      card.column_id = toColumnId
      card.position = (typeof toIndex === 'number') ? toIndex : destCol.cards.length

      if (toIndex === undefined || toIndex === null || toIndex > destCol.cards.length) {
        destCol.cards.push(card)
      } else {
        destCol.cards.splice(toIndex, 0, card)
      }

      // normalize positions
      destCol.cards.forEach((c, idx) => { c.position = idx })
    },

    removeCard(state, { cardId }) {
      for (const c of state.columns) {
        const idx = c.cards.findIndex(cc => cc.id === cardId)
        if (idx !== -1) { c.cards.splice(idx, 1); break }
      }
    },

    reorderColumnsLocally(state, orderedColumnIds) {
      const map = new Map(state.columns.map(c => [c.id, c]))
      const newOrder = []
      orderedColumnIds.forEach((id, idx) => {
        const col = map.get(id)
        if (col) {
          col.position = idx
          newOrder.push(col)
        }
      })
      state.columns.forEach(col => {
        if (!orderedColumnIds.includes(col.id)) {
          col.position = newOrder.length
          newOrder.push(col)
        }
      })
      state.columns = newOrder
    },

    replaceBoard(state, board) {
      if (!Array.isArray(board)) {
        console.warn('replaceBoard received non-array:', board)
        state.columns = []
        return
      }
      state.columns = board
    }
  },

  actions: {
    // Fetch board (columns + cards)
    async fetchBoard({ commit }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res = await axios.get('/api/columns')
        const columns = Array.isArray(res.data) ? res.data : res.data.columns ?? []
        commit('setColumns', columns)
        return columns
      } catch (e) {
        commit('setError', e)
        throw e
      } finally {
        commit('setLoading', false)
      }
    },

    // create a column
    async createColumn({ dispatch }, { name }) {
      const res = await axios.post('/api/columns', { name })
      // refresh board (simple)
      await dispatch('fetchBoard')
      return res.data
    },

    // create a card inside column (endpoint: POST /api/columns/:id/cards)
    async createCard({ commit }, { columnId, payload }) {
      const res = await axios.post(`/api/columns/${columnId}/cards`, payload)
      commit('addCard', { columnId, card: res.data })
      return res.data
    },

    // update card (PATCH /api/cards/:id)
    async updateCard({ commit }, { cardId, patch }) {
      const res = await axios.patch(`/api/cards/${cardId}`, patch)
      commit('upsertCard', res.data)
      return res.data
    },

    // delete card
    async deleteCard({ commit }, { cardId }) {
      await axios.delete(`/api/cards/${cardId}`)
      commit('removeCard', { cardId })
      return true
    },

    // Optimistic move: update locally then persist; rollback by fetching board if error
    async persistCardMove({ commit, dispatch }, { cardId, fromColumnId, toColumnId, toIndex }) {
      commit('moveCardLocally', { cardId, fromColumnId, toColumnId, toIndex })
      try {
        await axios.patch(`/api/cards/${cardId}`, { column_id: toColumnId, position: toIndex })
      } catch (e) {
        // rollback full board snapshot from server
        await dispatch('fetchBoard')
        throw e
      }
    },

    // Batch sync positions (pass columns array or will use state)
    async syncPositions({ state, commit }, { columns } = {}) {
      // columns param expected: array of columns with cards in correct order.
      const cols = columns || state.columns
      // build payload: columns: [{id, cards: [{id, position}, ...]}, ...]
      const payload = {
        columns: cols.map(col => ({
          id: col.id,
          cards: (Array.isArray(col.cards) ? col.cards : []).map((card, idx) => ({ id: card.id, position: idx }))
        }))
      }

      // optimistic: replace local board with provided columns
      commit('setColumns', cols)

      try {
        await axios.post('/api/cards/sync-positions', payload)
        return true
      } catch (e) {
        // refresh from server on failure
        await this.dispatch('kanban/fetchBoard')
        throw e
      }
    },

    // Persist columns order (simple)
    async persistColumnOrder({ state }) {
      const payload = state.columns.map((c, idx) => ({ id: c.id, position: idx }))
      return axios.post('/api/boards/reorder-columns', { columns: payload })
    }
  }
}
