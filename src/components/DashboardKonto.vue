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
const change_login = () => {
  if(!new_login.value) return
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
    <label>Zmień hasło: </label><input type="password" class="mt-7 rounded-md ml-2 py-2 px-3 bg-gray-300 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" placeholder="*******">
    <button class="rounded-md text-sm ml-2 cursor-pointer text-white bg-violet-400 dark:bg-violet-900 p-2">Potwierdź</button>
    <h2 class="text-2xl clear-both mt-16 font-semibold text-red-600">Strefa zagrożenia</h2>
    <div class="rounded-md my-7 cursor-pointer text-white bg-red-500 w-fit text-center p-3">Usuń konto</div>
  </div>
</template>