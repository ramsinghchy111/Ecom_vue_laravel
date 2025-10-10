<script setup lang="ts">
import GuestLayout from '../components/GuestLayout.vue';

</script>

<template>
 <GuestLayout title="sign in to your account">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST" novalidate>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-100 ">Email address</label>
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-100">Password</label>
          <div class="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- moved below input and right-aligned -->
          <div class="mt-2 text-right text-sm">
          <RouterLink 
            to="/request-password" 
            class="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Forgot password?
          </RouterLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </GuestLayout>
</template>
