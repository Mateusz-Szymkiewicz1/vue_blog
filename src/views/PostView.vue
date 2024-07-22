<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { ref, onUpdated } from 'vue'
  import { decision } from '../composables/Decision.vue'
  const emit = defineEmits(['toast'])
  const route = useRoute()
  const router = useRouter()
  const id = route.params.id
  const error = ref("")
  const post = ref({})
  fetch('http://localhost:3000/post/'+id).then(res => res.json()).then(res => {
        if(res.status == 0){
            error.value = res.text
        }else{
            post.value = res[0]
            post.value.data = post.value.data.slice(0, 10)
            if(post.value.tagi){
              post.value.tagi = JSON.parse(post.value.tagi)
            }
        }
  })

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

  const usun_post = async () => {
      if (document.querySelector(".decision")) document.querySelector('.decision').remove()
      const response = await decision().then(function () {
          document.querySelector(".decision").remove()
          return
      }, function () {
          document.querySelector(".decision").remove()
          return "stop"
      });
      if(response) return
      fetch("http://localhost:3000/usunpost", {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: post.value.id
        })
      }).then(res => res.json()).then(res => {
        if(res == "done"){
          emit("toast", {type:"message", msg: "Usunięto post!"})
          router.replace("/dashboard?toast=true")
        }
      })
    }
</script>

<template>
  <main v-if="error" class="grid min-h-[50vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-6xl font-semibold text-violet-600">404</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-200 sm:text-5xl">Nie znaleziono strony</h1>
      <p class="mt-6 leading-7 text-gray-600 dark:text-slate-400">Przepraszamy, nie znaleźliśmy strony której szukasz.</p>
    </div>
  </main>
  <div v-else class="post p-9 pr-36 mt-5">
      <h1 class="font-semibold dark:text-slate-200 my-10 text-4xl">
        {{ post.tytul }}
        <span class="text-lg dark:text-slate-400 font-normal text-slate-600 ml-1">{{ post.data }}</span>
        <span v-for="tag in post.tagi" class="rounded-md dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2">{{ tag }}</span>
        <router-link :to="'/post/edit/'+post.id"><span v-if="user" class="rounded-md cursor-pointer dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2"><i class="fa fa-pencil text-sm mr-2"></i>Edytuj</span></router-link>
        <span v-if="user" @click="usun_post" class="rounded-md cursor-pointer dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2"><i class="fa fa-trash text-sm mr-2"></i>Usuń</span>
      </h1>
      <img v-if="post.img" :src="'../../photos/'+post.img" onerror="this.src='../src/assets/placeholder.png'">
      <p class="text-lg dark:text-slate-400 py-10" v-html="post.tresc"></p>
    </div>
</template>

<style>
  .post p img{
    margin-top: 20px;
    margin-bottom: 20px;
    max-width: 80vw;
  }
  .post span{
    white-space:nowrap;
  }
  .post .ql-size-small{
    @apply text-sm;
  }
  .post .ql-size-large{
    @apply text-3xl;
  }
  .post .ql-size-huge{
    @apply text-4xl;
  }
  .post ol{
    list-style: decimal;
    @apply ml-10;
  }
  .post p a{
    @apply text-violet-600 underline;
  }
  .post blockquote{
    @apply p-4 my-4 border-s-4 border-violet-600 bg-neutral-100 dark:bg-neutral-800
  }
</style>