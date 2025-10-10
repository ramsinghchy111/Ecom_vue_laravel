<template>
  <header
    class="fixed top-0 inset-x-0 z-50 bg-white/80  dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 backdrop-blur"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Group: Logo + Search -->
      <div class="flex items-center gap-8 flex-1">
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-blue-600">
          <img src="https://news.sobij.com/storage/logo.png" class="h-8 w-auto" />
        </RouterLink>

        <div class="hidden md:block flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    <!-- avatar logo -->
       <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton
              class="inline-flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Open user menu"
            >
              <img src="https://randomuser.me/api/portraits/men/1.jpg" class="w-10 h-10 rounded-full object-cover" alt="User avatar" />
            <small class="text-gray-500 font-semibold">John Smith</small>
            </MenuButton>
          </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                <EditIcon
                  :active="active"
                  class="mr-2 h-5 w-5 text-violet-400"
                  aria-hidden="true"
                />
                Profile
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                <DuplicateIcon
                  :active="active"
                  class="mr-2 h-5 w-5 text-violet-400"
                  aria-hidden="true"
                />
                Logout
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
</script>
