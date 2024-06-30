<script setup>
  import {ref} from 'vue'
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

  const tytul = ref("")
  const tekst = ref("")
</script>

<template>
  <div v-if="user" class="px-8 md:px-16 mb-16">
    <h1 class="text-center font-semibold text-gray-900 mb-10 text-4xl mt-16 dark:text-slate-200">Nowy post</h1>
    <input v-model="tytul" type='text' maxlength="200" placeholder='Tytuł' class="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" />
    <textarea v-model="tekst" placeholder='Tekst' class="w-full rounded-md px-4 bg-gray-100 text-sm pt-3 outline-[#007bff] dark:text-slate-200 h-96 dark:bg-neutral-700 mt-5"></textarea>
  </div>
</template>