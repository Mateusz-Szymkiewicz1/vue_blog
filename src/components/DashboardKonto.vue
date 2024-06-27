<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(['user'])
const router = useRouter()
const wyloguj = () => {
  fetch("http://localhost:3000/wyloguj", {
    credentials: 'include',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(() => router.go())
}
const new_login = ref("")
const error = ref("")
const change_login = () => {
  if(!new_login.value){
    error.value = "Podaj login!"
    return
  }
  if(!/^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/.test(new_login.value)){
    error.value = "Login może składać się tylko z liter i cyfr oraz znaków . _ oraz -"
    return
  }
  if (confirm("Na pewno chcesz zmienić login?") == false) return
  fetch("http://localhost:3000/user/"+new_login.value).then(res => res.json()).then(res => {
    if(res.status == 0){
      fetch("http://localhost:3000/zmianaloginu", {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nowy_login: new_login.value,
          stary_login: props.user
        })
      }).then(wyloguj())
    }else{
      error.value = "Login zajęty!"
    }
  })
}
const new_pass = ref("")
const change_pass = () => {
  if(!new_pass.value || new_pass.value.length < 5){
    error.value = "Hasło musi zawierać min. 5 znaków!"
    return
  }
  if (confirm("Na pewno chcesz zmienić hasło?") == false) return
  fetch("http://localhost:3000/sprawdzhaslo", {
    credentials: 'include',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      haslo: new_pass.value,
      login: props.user
    })
  }).then(res => res.json()).then(res => {
    if(res){
      error.value = "Nowe hasło musi się różnić od poprzedniego!"
    }else{
      fetch("http://localhost:3000/zmianahasla", {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nowe_haslo: new_pass.value,
          login: props.user
        })
      }).then(wyloguj())
    }
  })
}
</script>

<template>
  <div class="pl-5 pb-5">
    <div @click="wyloguj" class="rounded-md my-10 cursor-pointer text-white bg-violet-600 float-left p-3">Wyloguj się</div>
    <h2 class="text-2xl pt-3 clear-both font-semibold">Dane logowania</h2>
    <label>Zmień login: </label><input v-model="new_login" type="text" class="mt-7 rounded-md ml-2 py-2 px-3 bg-gray-300 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" :placeholder="user">
    <button @click="change_login" class="rounded-md text-sm ml-2 cursor-pointer text-white bg-violet-400 dark:bg-violet-900 p-2">Potwierdź</button><br/>
    <label>Zmień hasło: </label><input type="password" v-model="new_pass" class="mt-7 rounded-md ml-2 py-2 px-3 bg-gray-300 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" placeholder="*******">
    <button @click="change_pass" class="rounded-md text-sm ml-2 cursor-pointer text-white bg-violet-400 dark:bg-violet-900 p-2">Potwierdź</button>
    <h2 class="text-2xl clear-both mt-16 font-semibold text-red-600">Strefa zagrożenia</h2>
    <div class="rounded-md my-7 cursor-pointer text-white bg-red-500 w-fit text-center p-3">Usuń konto</div>
  </div>

  <div class="fixed bottom-4 z-50 right-4 min-w-64" v-if="error">
    <div class="dark:bg-rose-950 flex justify-between bg-red-500 rounded-lg shadow-lg border border-red-600 dark:border-rose-900 p-4">
        <p class="text-white text-lg mr-5 dark:text-slate-200">
          {{ error }}
        </p>
        <button @click="error = ''" class="text-white dark:text-slate-200 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
  </div>
</template>