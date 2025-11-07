<template>
  <div>
    <TaskBoard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TaskBoard from "../components/TaskBoard.vue";

export default defineComponent({
  name: 'CRM',
  components: {TaskBoard}
})
</script>

