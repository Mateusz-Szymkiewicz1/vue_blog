<script setup>
import { useRouter } from 'vue-router'
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
</script>

<template>
  <div class="container">
    <div @click="wyloguj" class="rounded-md m-5 cursor-pointer text-white bg-rose-900 float-left p-3">Wyloguj się</div>
  </div>
</template>