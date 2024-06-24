<script setup>
  import {ref, onUpdated} from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const current_page = ref("blog")
  const user = ref("")
  fetch("http://localhost:3000/logowanie", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(res => {
      if(res.text){
        router.replace("/")
      }else{
        user.value = res
      }
  })
</script>

<template>
  <div v-if="user">
    <h1 class="text-center font-semibold text-gray-900 text-4xl mt-16 dark:text-slate-200">Panel Zarządzania</h1>
    <div class="w-auto dark:bg-neutral-900 bg-violet-100 dark:text-slate-200 min-h-96 m-10">
      <div class="bg-violet-200 text-2xl dark:bg-neutral-800 h-14 flex items-center">
        <span @click="current_page = 'blog'" class="h-full cursor-pointer flex items-center px-3" :class="current_page == 'blog' ? 'text-violet-700' : null"><i class="fa fa-book mr-2"></i>Blog</span>
        <span @click="current_page = 'konto'" class="h-full cursor-pointer flex items-center px-3" :class="current_page == 'konto' ? 'text-violet-700' : null"><i class="fa fa-user mr-2"></i>Konto</span>
      </div>
    </div>
  </div>
</template>