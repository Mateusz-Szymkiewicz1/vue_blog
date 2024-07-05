<script setup>
  import {ref, watch} from 'vue'
  import Multiselect from '@vueform/multiselect'
  import { decision } from '../composables/Decision.vue'
  const wpisy = ref([])
  const wpisy_backup = ref([])
  const error = ref("")
  const search = ref("")
  const tags = ref([])
  const selected_tags = ref([])
  const sort = ref("najnowsze")
  const post_limit = ref(20)
  fetch('http://localhost:3000/posty').then(res => res.json()).then(res => {
      if(res.status == 0){
        error.value = res.text
      }else{
        res.forEach(el => {
          el.data = el.data.slice(0, 10)
          if(el.tagi){
            el.tagi = JSON.parse(el.tagi)
            el.tagi.forEach(tag => {
              if(!tags.value.includes(tag)){
                tags.value.push(tag)
              }
            })
          }
          el.tresc = el.tresc.replace(/(<([^>]+)>)/ig, '')
          wpisy_backup.value.push(el)
        })
      }
  }).then(() => {
    wpisy.value = [...wpisy_backup.value]
  })
  
  watch([search, selected_tags], () => {
    wpisy.value = wpisy_backup.value.filter(el => el.tytul.toLowerCase().includes(search.value.toLowerCase()))
    selected_tags.value.forEach(tag => {
      wpisy.value = wpisy.value.filter(el => el.tagi.includes(tag))
    })
    if(sort.value == "najnowsze"){
            wpisy.value = wpisy.value.sort(function(a,b){
                return new Date(b.data) - new Date(a.data);
            });
        } 
        if(sort.value == "najstarsze"){
            wpisy.value = wpisy.value.sort(function(a,b){
                return new Date(a.data) - new Date(b.data);
            });
        } 
  })

  watch(sort, () => {
        if(sort.value == "najnowsze"){
            wpisy.value = wpisy.value.sort(function(a,b){
                return new Date(b.data) - new Date(a.data);
            });
        } 
        if(sort.value == "najstarsze"){
            wpisy.value = wpisy.value.sort(function(a,b){
                return new Date(a.data) - new Date(b.data);
            });
        } 
    })
    const usun_post = async (id) => {
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
            id: id
        })
      }).then(res => res.json()).then(res => {
        if(res == "done"){
          wpisy_backup.value = wpisy_backup.value.filter((item) => item.id !== id);
          wpisy.value = wpisy.value.filter((item) => item.id !== id);
        }
      })
    }
</script>

<template>
  <div class="container pb-5 pl-3">
    <main v-if="error" class="grid min-h-[70vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div class="text-center">
            <p class="text-6xl font-semibold text-violet-600">500</p>
            <h1 class="mt-4 text-3xl font-bold dark:text-slate-200 tracking-tight text-gray-900 sm:text-5xl">Błąd serwera</h1>
            <p class="mt-6 leading-7 dark:text-slate-300 text-gray-600">Przepraszamy, nie uzyskaliśmy połączenia z serwerem.</p>
            </div>
    </main>
    <div v-else>
      <div class="flex lg:gap-4 ml-3 -mt-8 flex-col lg:flex-row">
        <router-link to="/post/new"><div class="rounded-md flex !h-[38px] w-fit text-sm lg:mt-16 mt-14 mb-3 px-3 bg-violet-300 dark:bg-indigo-900 text-sm text-gray-800 dark:text-gray-400 items-center cursor-pointer"><i class="fa fa-circle-plus mr-2"></i><span>Nowy</span></div></router-link>
        <div class="relative w-72 !h-[38px] flex lg:mt-16">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" v-model="search" class="block w-full p-2 ps-10 text-sm dark:text-slate-200 text-gray-900 border dark:border-indigo-950 border-gray-300 rounded-lg dark:bg-indigo-950 bg-violet-200" placeholder="Szukaj..."/>
        </div>
        <Multiselect :searchable="true" class="lg:mt-16 mt-3 w-fit !p-0 !text-sm !text-gray-500 !h-[38px] dark:bg-indigo-950 bg-violet-200 rounded-lg border dark:border-indigo-950 border-gray-300" :max="5" :limit="10" mode="tags" placeholder="Tags" v-model="selected_tags" :options="tags">
       <template v-slot:option="{ option }">
         <span class="p-1 w-full px-2 font-normal dark:bg-indigo-950 bg-violet-50 dark:text-slate-200 text-gray-800 hover:bg-violet-100 dark:hover:bg-indigo-900">{{ option.value }}</span>
       </template>
    </Multiselect>
    <select v-model="sort" class="rounded-md !h-[38px] w-fit text-sm lg:mt-16 mt-3 px-3 bg-violet-200 dark:bg-indigo-950 text-sm text-gray-500 dark:text-gray-400">
        <option value="najnowsze" default>Data dodania: Najnowsze</option>
        <option value="najstarsze">Data dodania: Najstarsze</option>
    </select>
    </div>
      <table>
        <router-link v-for="wpis in wpisy.slice(0, post_limit)" :to="'/post/'+wpis.id">
          <tr class="bg-violet-200 dark:bg-indigo-950 dark:text-slate-200 m-3 block p-3">
            <td class="text-xl font-semibold">{{ wpis.tytul }} 
              <router-link :to="'/post/edit/'+wpis.id"><i class="fa fa-pencil text-sm ml-2 text-yellow-500"></i></router-link>
              <i @click.prevent="usun_post(wpis.id)" class="fa fa-trash text-sm ml-3 text-red-600"></i>
            </td>
            <img v-if="wpis.img" class="md:max-w-64 max-w-48 my-4 border-violet-300 border-2" :src="'../src/assets/photos/'+wpis.img" onerror="this.onerror=null; this.src='../src/assets/placeholder.png'">
            <td>{{ wpis.tresc.slice(0, 100)+"..." }}</td>
            <p class="my-3">
              <span v-for="tag in wpis.tagi" class="rounded-md dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 mr-2">{{ tag }}</span>
            </p>
            <td class="text-neutral-600 dark:text-slate-400">{{ wpis.data }}</td>
          </tr>
        </router-link>
      </table>
      <div v-if="post_limit < wpisy.length" @click="post_limit += 20" class="ml-3 rounded-md cursor-pointer text-white dark:text-slate-200 bg-violet-300 w-fit p-3 px-8 dark:bg-indigo-900">Więcej</div>
    </div>
  </div>
</template>

<style>
  td{
    display: block;
  }
  .dark .multiselect-dropdown{
    background: #2f2c5c;
    border: 1px solid #3f3d6d;
  }
</style>