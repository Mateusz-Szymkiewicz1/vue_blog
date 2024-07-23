<script setup>
  import {ref} from 'vue'
  import { decision } from '../composables/Decision.vue'
  const emit = defineEmits(['toast'])
  const props = defineProps(['user'])
  const messages = ref([])
  const messages_backup = ref([])
  const limit = ref(30)
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
      <div v-for="message in messages" class="text-indigo-950 dark:text-slate-200 text-xl m-3 flex justify-between overflow-hidden flex-wrap dark:bg-neutral-800 bg-violet-200 gap-1 p-4 cursor-pointer">
        <div>
          <h2 class="font-bold mr-5">{{ message.tytul }}</h2>
          <span>{{ message.tresc.slice(0,50)+"..." }}</span>
        </div>
        <div>
          <span class="text-sm">{{ message.data }}</span>
        </div>
      </div>
    </div>
  </div>
</template>