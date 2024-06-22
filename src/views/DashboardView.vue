<script setup>
  import {ref, onUpdated} from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
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
    <h1 class="text-center text-gray-900 text-4xl mt-16 dark:text-slate-200">Panel Zarządzania</h1>
  </div>
</template>