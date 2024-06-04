<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'

  const route = useRoute()
  const id = route.params.id
  const error = ref("")
  const post = ref({})
  fetch('http://localhost:3000/post/'+id).then(res => res.json()).then(res => {
        if(res.status == 0){
            error.value = res.text
        }else{
            post.value = res[0]
            post.value.data = post.value.data.slice(0, 10)
            post.value.tagi = JSON.parse(post.value.tagi)
        }
  })
</script>

<template>
  <main v-if="error" class="grid min-h-[50vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-6xl font-semibold text-violet-600">404</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-200 sm:text-5xl">Nie znaleziono strony</h1>
      <p class="mt-6 leading-7 text-gray-600 dark:text-slate-400">Przepraszamy, nie znaleźliśmy strony której szukasz.</p>
    </div>
  </main>
  <div v-else class="p-9 pr-36 mt-5">
      <h1 class="font-semibold dark:text-slate-200 text-4xl mt-6">
        {{ post.tytul }}
        <span class="text-lg dark:text-slate-400 font-normal text-slate-600 ml-1">{{ post.data }}</span>
        <span v-for="tag in post.tagi" class="rounded-md dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2">{{ tag }}</span>
      </h1>
      <p class="text-lg dark:text-slate-400 py-10" v-html="post.tresc"></p>
    </div>
</template>

<style scoped>
  img{
    margin-top: 20px;
    margin-bottom: 20px;
    max-width: 80vw;
  }
</style>