<script setup>
  import { ref } from 'vue'

  const menu = ref(false)
  const toggleMenu = () => {
      if(menu.value){
        menu.value = false
      }else{
        menu.value = true
      }
  }
</script>

<template>
   <div class="flex items-center justify-between p-6 lg:px-8">
      <div class="flex md:flex-1">
        <a href="/" class="-m-1.5 p-1.5"><img class="h-12 w-auto" src="../assets/logo.png"></a>
      </div>
      <div class="flex md:hidden">
        <button type="button" @click="toggleMenu" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div class="hidden md:flex md:gap-x-12 text-md font-semibold leading-6 text-gray-900">
        <a href="/">Strona główna</a>
        <a href="/about">O mnie</a>
        <a href="/kontakt">Kontakt</a>
      </div>
      <div class="hidden md:flex md:flex-1 md:justify-end">
        <a href="/logowanie" class="text-md font-semibold leading-6 text-gray-900">Zaloguj <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
    <div v-show="menu" class="md:hidden">
      <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="/" class="-m-1.5 p-1.5"><img class="h-12 w-auto" src="../assets/logo.png"></a>
          <button @click="toggleMenu" type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-12 flow-root">
          <div class="-my-6 divide-y divide-gray-600/10">
            <div class="space-y-2 py-6">
              <a href="/" class="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">Strona główna</a>
              <a href="/about" class="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">O mnie</a>
              <a href="/kontakt" class="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">Kontakt</a>
            </div>
            <div class="py-2">
              <a href="/logowanie" class="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">Zaloguj się</a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>