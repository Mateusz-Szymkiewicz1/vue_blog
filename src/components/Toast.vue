<script setup>
  const props = defineProps(['toast'])
</script>

<template>
  <div class="fixed bottom-4 z-50 right-4 min-w-64" v-if="toast.msg">
        <div :class="toast.type == 'error' ? 'dark:bg-rose-950 bg-red-500 dark:border-rose-900 border-red-600' : 'dark:bg-green-950 bg-green-500 dark:border-green-900 border-green-600'" class="flex justify-between rounded-lg shadow-lg p-4 border">
            <p class="text-white text-lg mr-5 dark:text-slate-200">
            {{ toast.msg }}
            </p>
            <button @click="$emit('closeToast')" class="text-white dark:text-slate-200 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
  </div>
</template>