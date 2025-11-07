<template>
  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Title" required />
    <textarea v-model="description" placeholder="Description"></textarea>
    <select v-model="column">
      <option value="todo">To Do</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
    <button type="submit">Create</button>
  </form>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
export default {
  data() { return { title: '', description: '', column: 'todo' }; },
  methods: {
    ...mapActions('tasks', ['createTask']),
    async submit() {
      const payload = { title: this.title, description: this.description, column: this.column };
      try {
        const created = await this.createTask(payload);
        this.$emit('created', created);
        this.title = this.description = '';
        this.column = 'todo';
      } catch (err) {
        alert('Error creating task: ' + (err.response?.data?.message || err.message));
      }
    }
  }
};
</script>
