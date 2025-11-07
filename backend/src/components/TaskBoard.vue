<template>
    <div class="flex flex-col md:flex-row gap-6 mt-4 items-start">
        <div
            v-for="col in columns"
            :key="col.key"
            class="min-w-[250px] bg-white rounded-2xl shadow-md p-4 border border-gray-100"
        >

        <div class="flex justify-between items-center border-b pb-2 mb-3">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ col.title }}
        </h3>

        <!-- + Add icon -->
        <button
          @click="openCreateModal(col.key)"
          class="text-gray-600 hover:text-blue-600 text-2xl font-bold"
          title="Add new task"
        >
          +
        </button>
      </div>

        <div class="space-y-3">
        <!-- Each task item -->
        <TaskItem
            v-for="task in tasksByColumn(col.key)"
            :key="task.id"
            :task="task"
            @move="moveTask"
            @delete="confirmDelete"
        />
        </div>
        </div>
    </div>

       <!-- <CreateTask
      v-if="showCreateModal"
      :defaultColumn="selectedColumn"
      @created="onCreated"
      @close="showCreateModal = false"
    /> -->
            <AddLeadModal
            v-if="showCreateModal"
            :visible="showCreateModal"
            :columnId="selectedColumn"
            @close="showCreateModal = false"
            @saved="onLeadSaved"
            />
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import TaskItem from './TaskItem.vue';
// import CreateTask from './CreateTask.vue';
import AddLeadModal from './AddLeadModal.vue';

export default {
  components: { TaskItem, AddLeadModal },
  data() {
    return {
        showCreateModal: false,  // <--- add this
        selectedColumn: null,
      columns: [
        { key: 'todo', title: 'To Do' },
        { key: 'in_progress', title: 'In Progress' },
        { key: 'done', title: 'Done' }
      ]
    };
  },
  computed: {
    ...mapGetters('tasks', ['totalTasks']),
    tasksByColumn() {
      // return a function used in template
      return (col) => this.$store.getters['tasks/tasksByColumn'](col);
    }
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    ...mapActions('tasks', ['fetchTasks', 'updateTask', 'deleteTask']),
    async moveTask({ task, toColumn }) {
  const movingWithinSameColumn = task.column === toColumn;
  const tasksInTarget = this.tasksByColumn(toColumn) || [];
  const numericOrders = tasksInTarget
    .map(t => {
      const n = t?.order;
      return (n === null || n === undefined || n === '') ? NaN : Number(n);
    })
    .filter(n => !Number.isNaN(n));
  const maxOrder = numericOrders.length ? Math.max(...numericOrders) : -1;
  const newOrder = movingWithinSameColumn
    ? (task.order !== null && task.order !== undefined ? task.order : maxOrder + 1)
    : (maxOrder + 1);
  const updated = {
    ...task,
    column: toColumn,
    order: newOrder
  };

  try {
    await this.updateTask(updated);
  } catch (err) {
    console.error('move failed', err);
    alert('Move failed — check console/network tab.');
  }
},

    async confirmDelete(taskId) {
      try {
        await this.deleteTask(taskId);
        console.log('deleted', taskId);
      } catch (err) {
        console.error('delete failed', err);
        alert('Delete failed — check console/network tab.');
      }
    },
    openCreateModal(columnKey) {
      this.selectedColumn = columnKey;
      this.showCreateModal = true;
    },
    onCreated() {
      this.showCreateModal = false;
      this.fetchTasks();
    }
  }
};
</script>
