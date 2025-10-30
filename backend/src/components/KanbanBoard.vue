<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @card-moved="handleCardMoved"
      @open-add-lead="openAddModal"
    />
    <AddLeadModal
      :visible="modalVisible"
      :columnId="modalColumnId"
      @close="closeAddModal"
      @saved="onCardSaved"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import KanbanColumn from './KanbanColumn.vue'
import AddLeadModal from './AddLeadModal.vue'

const store = useStore()
const columns = computed(() => store.getters['kanban/getColumns'])

const modalVisible = ref(false)
const modalColumnId = ref(null)

onMounted(() => {
  store.dispatch('kanban/fetchBoard').catch(e => console.error(e))
})

function openAddModal(columnId) {
  modalColumnId.value = columnId
  modalVisible.value = true
}

function closeAddModal() {
  modalVisible.value = false
  modalColumnId.value = null
}

async function onCardSaved(created) {
  // after server returns created card, ensure store is up-to-date
  // createCard action already commits addCard, so nothing needed here.
  // but we can refresh if needed:
  // await store.dispatch('kanban/fetchBoard')
  console.log('Card saved', created)
}

async function handleCardMoved(payload) {
  // payload expected: { cardId, fromColumnId, toColumnId, toIndex }
  try {
    await store.dispatch('kanban/persistCardMove', payload)
  } catch (e) {
    console.error('Failed to persist card move', e)
  }
}
</script>

<style scoped>
.kanban-board { display:flex; gap:12px; align-items:flex-start; padding:12px; overflow:auto; }
</style>
