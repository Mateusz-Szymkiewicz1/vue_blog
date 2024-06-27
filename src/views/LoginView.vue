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

  const pass_type = ref("password")
  const change_pass_type = () => {
    if(!event.pointerType) return
    if(pass_type.value == 'password'){
      pass_type.value = "text"
    }else{
      pass_type.value = 'password'
    }
  }
</script>

<template>
  <h1 class="sm:text-4xl text-3xl font-semibold dark:text-slate-200 text-center mb-8 mt-20">Logowanie</h1>
  <p class="text-xl text-red-600 font-semibold text-center mb-5" v-if="error">{{ error }}</p>
  <form class="mx-auto space-y-4 px-5 w-96 max-w-[90vw] pb-36">
      <input type='text' v-model="login" placeholder='Login' class="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" />
      <div class="relative w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-[#007bff] dark:text-slate-200 dark:bg-neutral-700">
        <input :type="pass_type" v-model="haslo" class="bg-transparent w-full pr-10" placeholder="Hasło">
        <button @click.prevent="change_pass_type" class="absolute top-0 end-0 p-3.5 rounded-e-md">
          <svg class="flex-shrink-0 size-4 text-gray-400 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line v-if="pass_type == 'password'" x1="2" x2="22" y1="2" y2="22"></line>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      <button @click.prevent="zaloguj" class="text-white bg-violet-400 hover:bg-violet-500 dark:bg-indigo-950 dark:hover:bg-indigo-900 font-semibold rounded-md text-sm px-4 py-3 w-full">Zaloguj</button>
  </form>
</template>