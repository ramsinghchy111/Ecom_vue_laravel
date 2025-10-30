<script setup lang="ts">
import GuestLayout from '../components/GuestLayout.vue';
import { ref } from 'vue';
import store from '../store';
import router from '../router';

let loading = ref(false);
let errorMsg = ref("");


const user = {
  email: '',
  password: ''
}

function login(){
  loading.value = true;
  store.dispatch('login', user)
  .then(() => {
    loading.value = false;
    router.push({name:'Dashboard'})
  })
  .catch(({response}) => {
    loading.value = false;
    errorMsg.value = response.data.message;
  })
}
</script>

<template>
 <GuestLayout title="sign in to your account">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST" @submit.prevent="login" novalidate>
        <div v-if="errorMsg" class="flex items-center justify-center py-3 px-5 bg-red-500 text-white rounded">
          {{ errorMsg }}
          <span @click="errorMsg = ''" class="w-8 h-8 items-center justify-between rounded-full transition-colors cursor-pointer hover:bg-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

          </span>
        </div>
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
              v-model="user.email"
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
              v-model="user.password"
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
