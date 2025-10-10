<!-- src/components/Sidebar.vue -->
<template>
  <aside class="hidden lg:block col-span-3">
    <div class="sticky top-24 space-y-4">
      <section>
        <div class="mb-4">
          <h2 class="text-lg font-semibold uppercase tracking-wide text-white">BMS Suite</h2>
          <p class="text-xs text-white">Powerful business tools by Sobij</p>
        </div>

        <nav aria-label="Main">
          <ul class="space-y-2">
            <li v-for="link in links" :key="link.name">
              <RouterLink :to="link.to" custom v-slot="{ navigate, href, isActive }">
                <a
                  :href="href"
                  @click="navigate"
                  :class="[
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200',
                    isActive ? 'bg-gray-700' : 'hover:bg-gray-500'
                  ]"
                  :aria-current="isActive ? 'page' : undefined"
                >
                  <Icon :icon="link.icon" class="w-6 h-6" :class="link.color" />
                  <span class="text-white font-medium text-md">{{ link.name }}</span>
                </a>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

type NavLink = { name: string; icon: string; color?: string; to: any }

const links: NavLink[] = [
  { name: 'Dashboard', icon: 'mdi:home', color: 'text-purple-500', to: { name: 'Dashboard' } },
  { name: 'CRM',          icon: 'mdi:account-multiple-outline', color: 'text-white-600', to: { name: 'CRM' } },
  { name: 'Accounting',   icon: 'mdi:calculator', color: 'text-green-500', to: { name: 'Accounting' } },
  { name: 'eCommerce',    icon: 'mdi:cart-outline', color: 'text-orange-500', to: { name: 'Ecommerce' } },
  { name: 'Inventory',    icon: 'mdi:warehouse', color: 'text-yellow-500', to: { name: 'Inventory' } },
  { name: 'POS',          icon: 'mdi:cash-register', color: 'text-red-500', to: { name: 'POS' } },
]
</script>
