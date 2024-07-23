<script setup>
  import {ref} from 'vue'
  import { decision } from '../composables/Decision.vue'
  import Checkbox from 'primevue/checkbox';
  const emit = defineEmits(['toast'])
  const props = defineProps(['user'])
  const messages = ref([])
  const messages_backup = ref([])
  const message_limit = ref(30)
  const error = ref()

  fetch('http://localhost:3000/wiadomosci').then(res => res.json()).then(res => {
    if(res.status == 0){
      error.value = res.text
    }else{
      res.forEach(el => {
        el.data = el.data.split(".")[0].replace('T', " ")
        let dt = new Date(el.data)
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
        let dt_2 = new Date(dt)
        if(dt_2.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
          el.data = dt.getHours()+":"+dt.getMinutes()
        }else{   
          el.data = dt.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })+" "+dt.getHours()+":"+dt.getMinutes()
        }
        messages_backup.value.push(el)
      })
    }
  }).then(() => {
    messages.value = [...messages_backup.value]
  })
</script>

<template>
  <div class="p-5">
    <span v-if="error">{{error}}</span>
    <div v-else>
      <div v-for="message in messages.slice(0, message_limit)" class="text-indigo-950 dark:text-slate-200 text-xl m-3 flex justify-between overflow-hidden flex-wrap dark:bg-neutral-800 bg-violet-200 gap-1 p-4 cursor-pointer">
        <div>
          <h2 class="font-bold mr-5"><input type="checkbox">&nbsp;{{ message.tytul }}</h2>
          <p class="text-sm my-1 text-indigo-900 dark:text-violet-500"><a :href="'mailto:'+message.email">{{ message.email }}</a></p>
          <span class="text-lg">{{ message.tresc.slice(0,50)+"..." }}</span>
        </div>
        <div>
          <span class="text-sm text-indigo-900 dark:text-slate-300">{{ message.data }}</span>
        </div>
      </div>
    </div>
    <div v-if="message_limit < messages.length" @click="message_limit += 30" class="mx-3 rounded-md mb-20 cursor-pointer text-white dark:text-slate-200 bg-violet-400 w-fit p-3 px-8 dark:bg-indigo-900">Więcej</div>
  </div>
</template>