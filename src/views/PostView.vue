<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { ref, onUpdated } from 'vue'
  import { decision } from '../composables/Decision.vue'
  import StarRating from 'vue-star-rating'
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
    
    const rating = ref()
    const review_text = ref("")
    const review_name = ref("")
    const review_email = ref("")
    const setRating = (e) => {
      rating.value = e;
    }
    const sendReview = () => {
      if(!review_name.value || !review_email.value){
        emit("toast", {type:"error", msg: "Podaj nazwę użytkownika oraz email!"})
        return;
      }
      if(!review_text.value && !rating.value){
        emit("toast", {type:"error", msg: "Nie przesyłaj pustej opini!"})
        return;
      }
      if(!/^[a-zA-Z0-9 ]*$/.test(review_name.value)){
        emit("toast", {type:"error", msg: "Podpis może się składać tylko z liter i cyfr!"})
        return;
      }
      if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(review_email.value)){
        emit("toast", {type:"error", msg: "Błędny email!"})
        return;
      }
      // fetch("http://localhost:3000/dodajopinie", {
      //   credentials: 'include',
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //       id: post.value.id,
      //       email: review_email.value,
      //       podpis: review_name.value,
      //       tekst: review_text.value,
      //       ocena: rating.value
      //   })
      // }).then(res => res.json()).then(res => {
      //   if(res == "done"){
      //     emit("toast", {type:"message", msg: "Dodano opinię!"})
      //   }
      // })
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
      <div class="mb-10">
        <h3 class="text-2xl mt-10 font-bold">Opinie</h3>
        <textarea v-model="review_text" class="mt-5 rounded p-3 w-96 h-48 bg-purple-200 dark:bg-neutral-800" placeholder="Napisz co myślisz..."></textarea><br>
        <input v-model="review_name" type="text" class="mt-2 bg-purple-200 w-96 rounded dark:bg-neutral-800 p-3" placeholder="Podpis"><br>
        <input v-model="review_email" type="email" class="mt-3 bg-purple-200 w-96 rounded dark:bg-neutral-800 p-3" placeholder="E-mail (niewidoczny)"><br/>
        <label class="float-left dark:text-slate-200 text-lg pt-5 mr-3">Ocena: </label><star-rating class="my-5" :star-size="30" active-color="#7e22ce" :show-rating="false" @update:rating="setRating"></star-rating>
        <div @click="sendReview" class="rounded-md my-5 mb-10 cursor-pointer text-white hover:bg-violet-500 bg-violet-600 w-fit p-2 px-4"><i class="fa fa-send mr-2"></i>Wyślij</div>
        <div v-for="opinia in post.opinie" class="bg-neutral-800 mt-3 p-5">
          <h3 class="text-2xl">{{ opinia.podpis }} {{ opinia.ocena ? " - "+opinia.ocena+"/5" : "" }}</h3>
          <p class="text-lg mt-3">{{ opinia.tekst }}</p>
        </div>
      </div>
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