<template>
  <div class="kanban-card" @dblclick="$emit('edit', card)">
    <div class="card-header">
      <strong class="card-title">{{ card.title }}</strong>
      <div class="card-actions">
        <button class="icon-btn" @click.stop="$emit('open', card)" title="Open">🔍</button>
        <button class="icon-btn" @click.stop="$emit('edit', card)" title="Edit">✎</button>
        <button class="icon-btn danger" @click.stop="$emit('delete', card)" title="Delete">🗑</button>
      </div>
    </div>

    <div class="card-meta">
      <div v-if="card.assigned_user" class="assigned">
        <small>Assigned: {{ card.assigned_user.name }}</small>
      </div>

      <div v-if="card.company_name" class="company">
        <small>{{ card.company_name }}</small>
      </div>

      <div class="contact-row">
        <small v-if="card.telephone">📞 {{ card.telephone }}</small>
        <small v-if="card.email">✉️ {{ card.email }}</small>
      </div>

      <div class="value" v-if="card.lead_value !== null && card.lead_value !== undefined">
        <small>Value: Rs {{ formatCurrency(card.lead_value) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  card: { type: Object, required: true }
})

const emits = defineEmits(['edit','delete','open'])

function formatCurrency(v: number|string|null) {
  if (v === null || v === undefined || v === '') return '0'
  const n = Number(v)
  if (isNaN(n)) return String(v)
  return n.toLocaleString()
}
</script>

<style scoped>
.kanban-card {
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 6px 12px rgba(10,10,30,0.06);
  margin-bottom: 8px;
  cursor: grab;
  user-select: none;
}
.card-header { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.card-title { font-size:14px; }
.card-actions { display:flex; gap:6px; align-items:center; }
.icon-btn { background:none; border:none; cursor:pointer; padding:4px; border-radius:6px; }
.icon-btn:hover { background:#f0f0f0; }
.icon-btn.danger { color:#c00; }
.card-meta { margin-top:8px; display:flex; flex-direction:column; gap:6px; font-size:12px; color:#333; }
.contact-row { display:flex; gap:8px; flex-wrap:wrap; }
.value { font-weight:600; margin-top:4px; }
</style>
