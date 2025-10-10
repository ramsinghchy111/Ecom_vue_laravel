<script setup lang="ts">
import GuestLayout from '../components/GuestLayout.vue';
</script>

<template>
<GuestLayout title="reset new password">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST" novalidate>
        <!-- INPUTS WRAPPER: only this container controls spacing between the two inputs -->
        <div class="mt-2 flex flex-col space-y-4">
          <div>
            <input
              type="password"
              name="resetPassword"
              placeholder="new-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="repeatPassword"
              placeholder="confirm"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="text-right text-sm">
          <RouterLink
            to="/login"
            class="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Remember password?
          </RouterLink>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            update
          </button>
        </div>
      </form>
    </div>
</GuestLayout>
</template>
