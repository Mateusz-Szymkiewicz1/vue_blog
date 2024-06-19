<script setup>
  import { ref, onUpdated } from 'vue'
  const props = defineProps(['url', 'theme'])
  const menu = ref(false)
  const toggleMenu = () => {
      if(menu.value){
        menu.value = false
      }else{
        menu.value = true
      }
  }

  const user = ref('')
  onUpdated(() => {
    fetch("http://localhost:3000/logowanie", {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json()).then(res => {
        if(!res.text){
          user.value = res
        }
    })
  })
</script>

<template>
  <div>
   <div class="flex  items-center dark:text-slate-200 text-gray-900 justify-between p-6 lg:px-8">
      <div class="flex md:flex-1 -m-1.5 p-1.5">
        <router-link to="/" @click="toggleMenu"><img class="h-12 w-auto" src="../assets/logo.png"></router-link>
      </div>
      <div class="flex md:hidden">
        <button type="button" @click="toggleMenu" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div class="hidden md:flex md:gap-x-12 text-md font-semibold leading-6">
        <router-link to="/" :class="url == 'home' ? 'font-bold underline decoration-violet-400' : null">Strona główna</router-link>
        <router-link to="/about" :class="url == 'about' ? 'font-bold underline decoration-violet-400' : null">O mnie</router-link>
        <router-link to="/kontakt" :class="url == 'kontakt' ? 'font-bold underline decoration-violet-400' : null">Kontakt</router-link>
      </div>
      <div class="hidden md:flex md:flex-1 md:justify-end">
        <i @click="$emit('themeSwitch')" class="fa dark:text-orange-200 text-amber-400 mr-3 text-2xl -mt-[2px] cursor-pointer" :class="theme == 'light' ? 'fa-sun' : 'fa-moon'"></i>
        <span class="pr-3">|</span>
        <router-link v-if="!user" to="/logowanie" class="text-md font-semibold leading-6">Zaloguj <span aria-hidden="true">&rarr;</span></router-link>
        <router-link v-if="user" to="/admin" class="text-md font-semibold leading-6">{{ user }} <span aria-hidden="true">&rarr;</span></router-link>
      </div>
    </div>
    <div v-show="menu" class="md:hidden text-gray-900 dark:text-slate-200">
      <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-neutral-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <router-link to="/" @click="toggleMenu" class="-m-1.5 p-1.5"><img class="h-12 w-auto" src="../assets/logo.png"></router-link>
          <button @click="toggleMenu" type="button" class="-m-2.5 rounded-md p-2.5">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-12 flow-root">
          <div class="-my-6 divide-y dark:divide-gray-600 divide-gray-600/10">
            <div class="space-y-2 py-6">
              <router-link to="/" @click="toggleMenu" class="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-neutral-800" :class="url == 'home' && theme == 'light' ? 'bg-violet-100 hover:bg-violet-200' : url == 'home' && theme == 'dark' ? 'bg-violet-950 dark:hover:bg-violet-900' : null">Strona główna</router-link>
              <router-link to="/about" @click="toggleMenu" class="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-neutral-800" :class="url == 'about' && theme == 'light' ? 'bg-violet-100 hover:bg-violet-200' : url == 'about' && theme == 'dark' ? 'bg-violet-950 dark:hover:bg-violet-900' : null">O mnie</router-link>
              <router-link to="/kontakt" @click="toggleMenu" class="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-neutral-800" :class="url == 'kontakt' && theme == 'light' ? 'bg-violet-100 hover:bg-violet-200' : url == 'kontakt' && theme == 'dark' ? 'bg-violet-950 dark:hover:bg-violet-900' : null">Kontakt</router-link>
            </div>
            <div class="py-2">
              <span @click="$emit('themeSwitch')" class="cursor-pointer -mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-neutral-800"><i class="fa dark:text-orange-200 text-amber-400 text-2xl mr-3 -mt-[2px] block float-left" :class="theme == 'light' ? 'fa-sun' : 'fa-moon'"></i> Motyw</span>
            </div>
            <div class="py-2">
              <router-link v-if="!user" @click="toggleMenu" to="/logowanie" class="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-neutral-800">Zaloguj się</router-link>
              <router-link v-if="user" @click="toggleMenu" to="/admin" class="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-neutral-800"><i class="fa-solid text-violet-500 pr-3 fa-table-columns"></i>{{ user }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>