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

  const show_message = () => {
    event.currentTarget.querySelector(".tresc").innerText = event.currentTarget.dataset.text
    event.currentTarget.classList.add("options")
  }

  const usun = async () => {
    if(!document.querySelector('input[type=checkbox]:checked')){
      emit("toast", {type:"error",msg:"Nie wybrano żadnej wiadomości!"})
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
    const do_usuniecia = []
    let do_usuniecia_str = ''
    document.querySelectorAll('input[type=checkbox]:checked').forEach(el => {
      do_usuniecia.push(parseInt(el.dataset.id))
      do_usuniecia_str += el.dataset.id+","
      el.checked = false;
    })
    do_usuniecia_str = do_usuniecia_str.slice(0, -1); 
    messages_backup.value = messages_backup.value.filter(el => !do_usuniecia.includes(el.id))
    messages.value = messages.value.filter(el => !do_usuniecia.includes(el.id))
    fetch("http://localhost:3000/usunwiadomosci", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: do_usuniecia_str
      })
    }).then(res => res.json()).then(res => {
      if(res == "done"){
        emit("toast", {type:"message", msg: "Usunięto wiadomości!"})
      }
    })
  }
</script>

<template>
  <div class="p-5">
    <span v-if="error">{{error}}</span>
    <div v-else>
      <div @click="usun" class="rounded-md ml-3 my-2 cursor-pointer text-white bg-violet-600 w-fit p-3"><i class="fa fa-trash mr-2"></i>Usuń</div>
      <div @click="show_message" v-for="message in messages.slice(0, message_limit)" class="text-indigo-950 dark:text-slate-200 text-xl m-3 flex justify-between break-all flex-wrap dark:bg-neutral-800 bg-violet-200 gap-1 p-4 cursor-pointer" :data-text="message.tresc">
        <div>
          <h2 class="font-bold mr-5"><input type="checkbox" @click.stop :data-id="message.id">&nbsp;{{ message.tytul }}</h2>
          <p class="text-sm my-1 text-indigo-900 dark:text-violet-500"><a @click.stop :href="'mailto:'+message.email">{{ message.email }}</a></p>
          <span class="tresc block pr-5 text-lg">{{ message.tresc.slice(0, 50)+"..." }}</span>
        </div>
        <div>
          <span class="text-sm text-indigo-900 dark:text-slate-300">{{ message.data }}</span>
        </div>
      </div>
    </div>
    <div v-if="message_limit < messages.length" @click="message_limit += 30" class="mx-3 rounded-md mb-20 cursor-pointer text-white dark:text-slate-200 bg-violet-400 w-fit p-3 px-8 dark:bg-indigo-900">Więcej</div>
  </div>
</template>