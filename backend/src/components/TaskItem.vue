<template>
  <div class="task-item">
    <h4>{{ task.title }}</h4>
    <p>{{ task.description }}</p>
    <div class="controls">
      <button v-if="task.column !== 'todo'" @click="$emit('move', { task, toColumn: 'todo' })">To Todo</button>
      <button v-if="task.column !== 'in_progress'" @click="$emit('move', { task, toColumn: 'in_progress' })">In Progress</button>
      <button v-if="task.column !== 'done'" @click="$emit('move', { task, toColumn: 'done' })">Done</button>
      <button  @click="$emit('delete', task.id)">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: { task: { type: Object, required: true } }
};
</script>
