<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import { decision } from '../composables/Decision.vue'
const emit = defineEmits(['toast'])
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
const change_login = async () => {
  if(!new_login.value){
    emit('toast',{type:"error",msg:"Podaj login!"})
    return
  }
  if(!/^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/.test(new_login.value)){
    emit('toast',{type:"error",msg:"Login może składać się tylko z liter i cyfr oraz znaków . _ oraz -!"})
    return
  }
  if (document.querySelector(".decision")) document.querySelector('.decision').remove()
  const response = await decision().then(function () {
      document.querySelector(".decision").remove()
      return
  }, function () {
      document.querySelector(".decision").remove()
      return "stop"
  });
  if(response) return
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
      emit('toast',{type:"error",msg:"Login zajęty!"})
    }
  })
}
const new_pass = ref("")
const change_pass = async () => {
  if(!new_pass.value || new_pass.value.length < 5){
    emit('toast',{type:"error",msg:"Hasło musi zawierać min. 5 znaków!"})
    return
  }
  if (document.querySelector(".decision")) document.querySelector('.decision').remove()
  const response = await decision().then(function () {
      document.querySelector(".decision").remove()
      return
  }, function () {
      document.querySelector(".decision").remove()
      return "stop"
  });
  if(response) return
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
      emit('toast',{type:"error",msg:"Nowe hasło musi się różnić od poprzedniego!"})
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
const pass_type = ref("password")
const change_pass_type = () => {
  if(!event.pointerType) return
  if(pass_type.value == 'password'){
    pass_type.value = "text"
  }else{
    pass_type.value = 'password'
  }
}

const usun_konto = async () => {
  if (document.querySelector(".decision")) document.querySelector('.decision').remove()
  const response = await decision().then(function () {
      document.querySelector(".decision").remove()
      return
  }, function () {
      document.querySelector(".decision").remove()
      return "stop"
  });
  if(response) return
  fetch("http://localhost:3000/usunkonto", {
    credentials: 'include',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        login: props.user
    })
  }).then(wyloguj())
}
</script>

<template>
  <div class="pl-5 pb-5">
    <div @click="wyloguj" class="rounded-md my-10 cursor-pointer text-white bg-violet-600 float-left p-3">Wyloguj się</div>
    <h2 class="text-2xl pt-3 clear-both font-semibold">Dane logowania</h2>
    <label>Zmień login: </label><input v-model="new_login" type="text" class="mt-7 rounded-md ml-2 py-2 px-3 bg-gray-300 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" :placeholder="user">
    <button @click="change_login" class="rounded-md text-sm ml-2 cursor-pointer text-white bg-violet-400 dark:bg-violet-900 p-2">Potwierdź</button><br/>
    <label class="float-left my-6 pr-1">Zmień hasło: </label>
    <div class="relative w-fit my-5 float-left rounded-md ml-2 py-2 px-3 bg-gray-300 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200">
        <input :type="pass_type" v-model="new_pass" class="bg-transparent w-full pr-10" placeholder="*******">
        <button @click.prevent="change_pass_type" class="absolute top-0 end-0 p-2.5 rounded-e-md">
          <svg class="flex-shrink-0 size-4 text-gray-400 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line v-if="pass_type == 'password'" x1="2" x2="22" y1="2" y2="22"></line>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    <button @click="change_pass" class="rounded-md my-5 text-sm ml-2 cursor-pointer text-white bg-violet-400 dark:bg-violet-900 p-2">Potwierdź</button>
    <h2 class="text-2xl clear-both mt-16 font-semibold text-red-600">Strefa zagrożenia</h2>
    <div @click="usun_konto" class="rounded-md my-7 cursor-pointer text-white bg-red-500 w-fit text-center p-3">Usuń konto</div>
  </div>
</template>