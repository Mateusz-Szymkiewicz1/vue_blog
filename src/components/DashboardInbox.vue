<script setup>
  import {ref,watch} from 'vue'
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
        el.data_format = el.data.split(".")[0].replace('T', " ")
        let dt = new Date(el.data_format)
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
        let dt_2 = new Date(dt)
        if(dt_2.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
          el.data_format = dt.getHours()+":"+dt.getMinutes()
        }else{   
          el.data_format = dt.toLocaleDateString("en-GB", {
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

  const search = ref("")
  const sort = ref("najnowsze")

  watch(search, () => {
    messages.value = messages_backup.value.filter(el => el.tytul.toLowerCase().includes(search.value.toLowerCase()) || el.email.toLowerCase().includes(search.value.toLowerCase()))
    if(sort.value == "najnowsze"){
      messages.value = messages.value.sort(function(a,b){
        return new Date(b.data) - new Date(a.data);
      });
    } 
    if(sort.value == "najstarsze"){
      messages.value = messages.value.sort(function(a,b){
        return new Date(a.data) - new Date(b.data);
      });
    } 
  })

  watch(sort, () => {
    if(sort.value == "najnowsze"){
      messages.value = messages.value.sort(function(a,b){
        return new Date(b.data) - new Date(a.data);
      });
    } 
    if(sort.value == "najstarsze"){
      messages.value = messages.value.sort(function(a,b){
        return new Date(a.data) - new Date(b.data);
      });
    } 
  })
</script>

<template>
  <div class="p-5">
    <span v-if="error">{{error}}</span>
    <div v-else>
      <div class="flex flex-wrap gap-3 ml-3 mt-5">
        <div class="relative w-72 !h-[38px] flex">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" v-model="search" class="block w-full p-2 ps-10 text-sm dark:text-slate-200 text-gray-900 border dark:border-indigo-950 border-gray-300 rounded-lg dark:bg-indigo-950 bg-violet-200" placeholder="Szukaj..."/>
        </div>
        <select v-model="sort" class="outline-none rounded-md !h-[38px] w-fit text-sm px-3 bg-violet-200 dark:bg-indigo-950 text-sm text-gray-500 dark:text-gray-400">
          <option value="najnowsze" default>Data dodania: Najnowsze</option>
          <option value="najstarsze">Data dodania: Najstarsze</option>
        </select>
        <div @click="usun" class="rounded-md cursor-pointer text-sm text-white bg-violet-600 w-fit p-2 px-4"><i class="fa fa-trash mr-2"></i>Usuń</div>
      </div>
      <div @click="show_message" v-for="message in messages.slice(0, message_limit)" class="text-indigo-950 dark:text-slate-200 text-xl m-3 flex justify-between break-all flex-wrap dark:bg-neutral-800 bg-violet-200 gap-1 p-4 cursor-pointer" :data-text="message.tresc">
        <div>
          <h2 class="font-bold mr-5"><input type="checkbox" @click.stop :data-id="message.id">&nbsp;{{ message.tytul }}</h2>
          <p class="text-sm my-1">{{ message.imie }}&nbsp;(<a @click.stop class="text-indigo-900 dark:text-violet-500" :href="'mailto:'+message.email">{{ message.email }}</a>)</p>
          <span class="tresc block pr-5 text-lg">{{ message.tresc.slice(0, 50)+"..." }}</span>
        </div>
        <div>
          <span class="text-sm text-indigo-900 dark:text-slate-300">{{ message.data_format }}</span>
        </div>
      </div>
    </div>
    <div v-if="message_limit < messages.length" @click="message_limit += 30" class="mx-3 rounded-md mb-20 cursor-pointer text-white dark:text-slate-200 bg-violet-400 w-fit p-3 px-8 dark:bg-indigo-900">Więcej</div>
  </div>
</template>