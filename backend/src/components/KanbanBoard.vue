<template>
  <div class="kanban-board">
    <!-- Loop over all columns -->
    <KanbanColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @card-moved="handleCardMoved"
      @open-add-card="openAddModal"
    />

    <!-- Modal to add a new card -->
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

// Vuex store
const store = useStore()

// --- STATE --- //
const modalVisible = ref(false)
const modalColumnId = ref<number | null>(null)

// --- COMPUTED --- //
// safely fetch normalized columns array from store
const columns = computed(() => store.getters['kanban/columnsList'])
const loading = computed(() => store.state.kanban.loading)
const error = computed(() => store.state.kanban.error)

// --- LIFECYCLE --- //
onMounted(async () => {
  try {
    await store.dispatch('kanban/fetchColumns')
  } catch (e) {
    console.error('Error loading Kanban board:', e)
  }
})

// --- METHODS --- //
function openAddModal(columnId: number) {
  modalColumnId.value = columnId
  modalVisible.value = true
}

function closeAddModal() {
  modalVisible.value = false
  modalColumnId.value = null
}

async function onCardSaved(createdCard: any) {
  // Card creation is already handled by store’s createCard action
  console.log('✅ Card saved successfully:', createdCard)
}

async function handleCardMoved(payload: { cardId: number, fromColumnId: number, toColumnId: number, toIndex: number }) {
  try {
    // Update store immediately (optimistic update)
    await store.dispatch('kanban/updateCard', {
      id: payload.cardId,
      column_id: payload.toColumnId,
      position: payload.toIndex
    })
  } catch (e) {
    console.error('❌ Failed to persist card move:', e)
  }
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  overflow-x: auto;
  min-height: 80vh;
  background: #f8f9fa;
}

/* Optional loading/error styles */
.loading {
  text-align: center;
  font-weight: 500;
  color: #888;
}

.error {
  color: #c00;
  text-align: center;
}
</style>
