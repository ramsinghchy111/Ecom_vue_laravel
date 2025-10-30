<template>
  <div
    class="kanban-column"
    :data-column-id="column.id"
    style="width:320px; background:#f5f5f5; padding:8px; border-radius:8px; flex-shrink:0;"
  >
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <h3 style="margin:0; font-size:16px;">{{ column.name }}</h3>
      <button type="button" @click="$emit('open-add-lead', column.id)" class="add-card-btn">+</button>
    </div>

    <draggable
      :list="localCards"
      group="cards"
      item-key="id"
      @change="onChange"
    >
      <template #item="{ element }">
        <KanbanCard :card="element" @edit="onEdit" @delete="onDelete" />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import KanbanCard from './KanbanCard.vue'
import { useStore } from 'vuex'

const props = defineProps({
  column: { type: Object, required: true }
})
const emits = defineEmits(['open-add-lead','card-moved','card-created'])

const store = useStore()

// local copy for vuedraggable
const localCards = ref((props.column.cards || []).slice())

watch(() => props.column.cards, (newCards) => {
  localCards.value = (newCards || []).slice()
}, { deep: true })

function onChange(evt) {
  // moving within same column
  if (evt.moved) {
    const card = evt.moved.element
    const newIndex = evt.moved.newIndex
    // update local store optimistically
    store.commit('kanban/moveCardLocally', {
      cardId: card.id,
      fromColumnId: props.column.id,
      toColumnId: props.column.id,
      toIndex: newIndex
    })
    // tell parent to persist
    emits('card-moved', { cardId: card.id, fromColumnId: props.column.id, toColumnId: props.column.id, toIndex: newIndex })
    return
  }

  // card was added from another column
  if (evt.added) {
    const card = evt.added.element
    const newIndex = evt.added.newIndex
    // attempt to detect source column id from DOM dataset if available
    const fromColumnId = evt.added?.oldDraggable?.el?.closest?.('[data-column-id]')?.dataset?.columnId
    let fromId = fromColumnId ? parseInt(fromColumnId) : null

    if (!fromId) {
      for (const c of store.state.kanban.columns) {
        if (c.cards.find(cc => cc.id === card.id)) { fromId = c.id; break }
      }
    }

    // optimistic local move
    store.commit('kanban/moveCardLocally', {
      cardId: card.id,
      fromColumnId: fromId,
      toColumnId: props.column.id,
      toIndex: newIndex
    })

    emits('card-moved', { cardId: card.id, fromColumnId: fromId, toColumnId: props.column.id, toIndex: newIndex })
    return
  }

  // removed event is handled by added at destination in cross-column moves
}
</script>

<style scoped>
.add-card-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: #e9ecfc;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.add-card-btn:hover { background-color: #bfbfbf; transform: scale(1.05); }
</style>
