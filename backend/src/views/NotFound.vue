<template>
   <div class="flex min-h-screen justify-center items-center">
    <div class="text-indigo-600 text-5xl px-8 font-bold ">404</div>
    <div class="flex flex-col space-y-0.5">
        <h1 class="text-4xl font-bold text-black">page not found</h1>
        <p class="text-1xl font-light">please check the url in address bar and try again</p>

        <div class="mt-4 bg-blue-600 w-30 h-8 flex items-center justify-center rounded-lg">
        <RouterLink to="/app/dashboard" class=" text-white font-medium hover:underline">Go back home</RouterLink>
        </div>
    </div>
   </div>
</template>

<script lang="ts">
</script>
