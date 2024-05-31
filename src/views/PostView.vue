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
  <div class="p-9 pr-36 mt-5">
    <p v-if="error" class="font-semibold text-2xl underline decoration-red-500">{{ error }}</p>
    <div v-else>
      <h1 class="font-semibold text-4xl mt-6">
        {{ post.tytul }}
        <span class="text-lg font-normal text-slate-600 ml-1">{{ post.data }}</span>
        <span v-for="tag in post.tagi" class="rounded-md bg-purple-100 px-2 py-1 text-sm text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2">{{ tag }}</span>
      </h1>
      <p class="text-lg py-10" v-html="post.tresc"></p>
    </div>
  </div>
</template>