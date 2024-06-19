<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const login = ref("")
  const haslo = ref("")
  const error = ref("")
  const zaloguj = () => {
    fetch("http://localhost:3000/logowanie", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login.value,
        haslo: haslo.value
      }),
    }).then(res => res.json()).then(res => {
      if(res.status == 0){
        error.value = res.text
      }else{
        router.push('/')
      }
    })
  }

  fetch("http://localhost:3000/logowanie", {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json()).then(res => {
        if(!res.text){
          router.replace("/")
        }
  })
</script>

<template>
  <h1 class="sm:text-4xl text-3xl font-semibold dark:text-slate-200 text-center mb-8 mt-20">Logowanie</h1>
  <p class="text-xl text-red-600 font-semibold text-center mb-5" v-if="error">{{ error }}</p>
  <form class="mx-auto space-y-4 px-5">
      <input type='text' v-model="login" placeholder='Login' class="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" />
      <input type='password' v-model="haslo" placeholder='Hasło' class="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-[#007bff] dark:text-slate-200 dark:bg-neutral-700" />
      <button @click.prevent="zaloguj" class="text-white bg-violet-400 hover:bg-violet-500 dark:bg-indigo-950 dark:hover:bg-indigo-900 font-semibold rounded-md text-sm px-4 py-3 w-full">Zaloguj</button>
  </form>
</template>