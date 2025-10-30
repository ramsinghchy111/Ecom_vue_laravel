<template>
  <div>
    <KanbanBoard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KanbanBoard from "../components/KanbanBoard.vue";

export default defineComponent({
  name: 'CRM',
  components: {KanbanBoard}
})
</script>

