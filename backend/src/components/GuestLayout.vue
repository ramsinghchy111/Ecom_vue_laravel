<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-6 text-center text-2xl font-bold tracking-tight text-white">{{ title }}</h2>
    </div>

    <div>
     <slot/>
    </div>

  </div>
</template>


<script setup lang="ts">

const {title} = defineProps({
    title: String
})

</script>


