<template>
  <transition name="modal-fade">
    <div v-if="visible" class="overlay" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" ref="modalRoot" tabindex="-1">
        <form @submit.prevent="submit" class="modal-inner">
          <div class="modal-header">
            <h3 style="margin:0">Add Lead</h3>
            <button type="button" class="close-x" @click="close" aria-label="Close">✕</button>
          </div>

          <!-- basic fields -->
          <div class="field">
            <label>Lead Title <span class="req">*</span></label>
            <input v-model="form.title" required />
          </div>

          <div class="two-col">
            <div class="field">
              <label>First Name</label>
              <input v-model="form.first_name" />
            </div>
            <div class="field">
              <label>Last Name</label>
              <input v-model="form.last_name" />
            </div>
          </div>

          <div class="two-col">
            <div class="field">
              <label>Telephone</label>
              <input v-model="form.telephone" />
            </div>
            <div class="field">
              <label>Email Address</label>
              <input v-model="form.email" type="email" />
            </div>
          </div>

          <div class="field">
            <label>Address</label>
            <input v-model="form.address" />
          </div>

          <div class="two-col">
            <div class="field">
              <label>Lead Value (Rs)</label>
              <input v-model.number="form.lead_value" type="number" min="0" />
            </div>
            <div class="field">
              <label>Assigned</label>
              <select v-model="form.assigned_to">
                <option value="">Unassigned</option>
                <option v-for="u in assigneesList" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>
          </div>

          <!-- Details toggle -->
          <div class="toggle-row" @click="form.showDetails = !form.showDetails" role="button">
            <strong>Details</strong>
            <span>{{ form.showDetails ? '▾' : '▸' }}</span>
          </div>
          <div v-if="form.showDetails" class="field">
            <label>Details</label>
            <textarea v-model="form.details" rows="4"></textarea>
          </div>

          <!-- Org toggle -->
          <div class="toggle-row" @click="form.showOrg = !form.showOrg" role="button">
            <strong>Address & Organization Details</strong>
            <span>{{ form.showOrg ? '▾' : '▸' }}</span>
          </div>
          <div v-if="form.showOrg" class="org-grid">
            <div class="field">
              <label>Company Name</label>
              <input v-model="form.company_name" />
            </div>
            <div class="field">
              <label>Street</label>
              <input v-model="form.street" />
            </div>

            <div class="two-col">
              <div class="field">
                <label>City</label>
                <input v-model="form.city" />
              </div>
              <div class="field">
                <label>State</label>
                <input v-model="form.state" />
              </div>
            </div>

            <div class="two-col">
              <div class="field">
                <label>Zip Code</label>
                <input v-model="form.zip" />
              </div>
              <div class="field">
                <label>Country</label>
                <input v-model="form.country" />
              </div>
            </div>

            <div class="field">
              <label>Websites (comma separated)</label>
              <input v-model="form.websites" placeholder="https://example.com, ..." />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn secondary" @click="close">Cancel</button>
            <button type="submit" class="btn primary" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save & Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  visible: { type: Boolean, required: true },
  columnId: { type: [String, Number], required: false },
  assignees: { type: Array, required: false }
})
const emits = defineEmits(['close','saved'])

const store = useStore()
const submitting = ref(false)
const modalRoot = ref(null)

const form = ref({
  title: '',
  first_name: '',
  last_name: '',
  telephone: '',
  email: '',
  address: '',
  lead_value: null,
  assigned_to: '',
  details: '',
  showDetails: false,
  showOrg: false,
  company_name: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  websites: ''
})

// assignees fallback
const assigneesList = props.assignees || (store.state?.users ? store.state.users.map(u => ({ id: u.id, name: u.name })) : [])

watch(() => props.visible, (v) => {
  if (v) {
    nextTick(() => modalRoot.value?.focus())
  } else resetForm()
})

function resetForm() {
  form.value = {
    title: '',
    first_name: '',
    last_name: '',
    telephone: '',
    email: '',
    address: '',
    lead_value: null,
    assigned_to: '',
    details: '',
    showDetails: false,
    showOrg: false,
    company_name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    websites: ''
  }
}

function close() {
  emits('close')
}

async function submit() {
  if (!form.value.title || !form.value.title.trim()) {
    alert('Lead Title required')
    return
  }
  submitting.value = true

  const payload = {
    title: form.value.title,
    description: form.value.details || '',
    first_name: form.value.first_name || null,
    last_name: form.value.last_name || null,
    telephone: form.value.telephone || null,
    email: form.value.email || null,
    address: form.value.address || null,
    lead_value: form.value.lead_value || 0,
    assigned_to: form.value.assigned_to || null,
    company_name: form.value.company_name || null,
    street: form.value.street || null,
    city: form.value.city || null,
    state: form.value.state || null,
    zip: form.value.zip || null,
    country: form.value.country || null,
    websites: (form.value.websites || '').split(',').map(s => s.trim()).filter(Boolean)
  }

  try {
    const created = await store.dispatch('kanban/createCard', { columnId: props.columnId, payload })
    emits('saved', created)
    close()
  } catch (err) {
    console.error(err)
    alert('Failed to create lead. See console.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* overlay + centered modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 2400;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(10,10,25,0.18);
  overflow:auto;
  max-height: 90vh;
  outline: none;
}

.modal-inner { padding: 18px; display:flex; flex-direction:column; gap: 10px; }
.modal-header { display:flex; justify-content:space-between; align-items:center; }
.close-x { background:none; border:none; font-size:18px; cursor:pointer; opacity:0.6; }
.close-x:hover { opacity:1; }

.field { display:flex; flex-direction:column; gap:6px; }
.field input, .field textarea, .field select { padding:8px; border-radius:6px; border:1px solid #e6edf6; font-size:14px; }
.field textarea { min-height:80px; resize:vertical; }

.two-col { display:flex; gap:8px; }
.two-col > * { flex:1; display:flex; flex-direction:column; }

.toggle-row { display:flex; justify-content:space-between; align-items:center; padding:8px 6px; background:#fafafa; border-radius:6px; cursor:pointer; border:1px solid #f0f0f0; }
.org-grid { display:flex; flex-direction:column; gap:8px; }

.modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:8px; }
.btn { padding:8px 12px; border-radius:6px; cursor:pointer; border:1px solid transparent; }
.btn.primary { background:#2363cc; color:#fff; }
.btn.secondary { background:#f3f4f6; color:#111; border-color:#e6e7ea; }

.req { color:#c00; font-weight:700; }

/* transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all .18s ease; }
.modal-fade-enter-from { transform: translateY(12px) scale(.98); opacity:0; }
.modal-fade-enter-to { transform: translateY(0) scale(1); opacity:1; }
.modal-fade-leave-from { transform: translateY(0) scale(1); opacity:1; }
.modal-fade-leave-to { transform: translateY(12px) scale(.98); opacity:0; }
</style>
