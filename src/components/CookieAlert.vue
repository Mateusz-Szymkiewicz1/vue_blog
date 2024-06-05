<script setup>
  import { ref } from 'vue'
  const show_cookies = ref(true)
  if(localStorage.getItem("vue_blog_cookies")){
    show_cookies.value = false
  }
  const zgoda = () => {
    localStorage.setItem("vue_blog_cookies", true)
    show_cookies.value = false
    if(document.querySelector('.dark')){
      localStorage.setItem("vue_blog_theme", "dark");
    }
  }
</script>

<template>
  <div class="fixed bottom-4 z-50 right-4 w-72" v-if="show_cookies">
    <div class="dark:bg-neutral-800 bg-white rounded-lg shadow-lg border dark:border-neutral-700 border-gray-300  p-4">
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
                <img src="https://www.svgrepo.com/show/401340/cookie.svg" alt="Cookie" class="h-8 w-8 mr-2">
                <span class="text-gray-700 dark:text-slate-200 font-bold text-lg">Polityka Cookies</span>
            </div>
            <button @click="show_cookies = false" class="text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-300 hover:text-gray-700 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
        <p class="text-gray-600 text-lg dark:text-neutral-400">
            Ta strona używa plików cookies. Możesz nie zgodzić się na zapisywanie przes nas danych.
        </p>
        <button @click="zgoda" class="mt-4 dark:bg-indigo-900 dark:hover:bg-indigo-800 bg-violet-500 mr-3 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded">OK</button>
        <button @click="show_cookies = false" class="mt-4 dark:bg-indigo-900 dark:hover:bg-indigo-800 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded">Odmów</button>
    </div>
   </div>
</template>