<script setup>
    import { ref, watch } from 'vue'
    import Multiselect from '@vueform/multiselect'
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
</script>

<template>
    <main v-if="error" class="grid min-h-[70vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div class="text-center">
            <p class="text-6xl font-semibold text-violet-600">500</p>
            <h1 class="mt-4 text-3xl font-bold dark:text-slate-200 tracking-tight text-gray-900 sm:text-5xl">Błąd serwera</h1>
            <p class="mt-6 leading-7 dark:text-slate-300 text-gray-600">Przepraszamy, nie uzyskaliśmy połączenia z serwerem.</p>
            </div>
        </main>
    <div v-else>
        <div class="flex md:gap-4 ml-6 lg:ml-8 flex-col md:flex-row">
        <div class="relative w-72 mt-16">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" v-model="search" class="block w-full p-2 ps-10 text-sm dark:text-slate-200 text-gray-900 border dark:border-indigo-950 border-gray-300 rounded-lg dark:bg-indigo-950 bg-violet-100" placeholder="Szukaj..."/>
        </div>
        <Multiselect :searchable="true" class="md:mt-16 mt-4 w-fit !p-0 !text-sm !text-gray-400 !h-[38px] dark:bg-indigo-950 bg-violet-100 rounded-lg border dark:border-indigo-950 border-gray-300" :max="5" :limit="10" mode="tags" placeholder="Tags" v-model="selected_tags" :options="tags">
       <template v-slot:option="{ option }">
         <span class="p-1 w-full px-2 font-normal dark:bg-indigo-950 bg-violet-50 dark:text-slate-200 text-gray-700 hover:bg-violet-100 dark:hover:bg-indigo-900">{{ option.value }}</span>
       </template>
    </Multiselect>
    <select v-model="sort" class="rounded-md !h-[38px] w-fit text-sm md:mt-16 mt-4 px-3 bg-violet-100 dark:bg-indigo-950 text-sm text-gray-500 dark:text-gray-400">
        <option value="najnowsze" default>Data dodania: Najnowsze</option>
        <option value="najstarsze">Data dodania: Najstarsze</option>
    </select>
    </div>
        <div class="container mt-5 flex flex-wrap p-6 pt-0 lg:px-8 gap-6">
            <router-link v-for="wpis in wpisy.slice(0, post_limit)" :to="'/post/'+wpis.id">
                <div class="wpis md:flex md:h-64 py-2 px-5 dark:bg-indigo-950 bg-violet-200 cursor-pointer hover:bg-violet-300 dark:hover:bg-indigo-900 transition-all  duration-300 hover:translate-y-[-2px]">
                    <div class="max-w-[400px]">
                        <h3 class="text-2xl dark:text-slate-200 text-slate-800 font-bold mt-3">{{ wpis.tytul }}<span class="text-lg font-normal dark:text-slate-300 text-slate-600 ml-2 whitespace-nowrap">{{ wpis.data }}</span></h3>
                        <p class="mt-5">
                            <span v-for="tag in wpis.tagi" class="rounded-md dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 mr-2">{{ tag }}</span>
                        </p>
                        <p class="my-2 mt-4 dark:text-slate-300 text-slate-600">{{ wpis.tresc.slice(0, 200)+"..." }}</p>
                    </div>
                    <img v-if="wpis.img" class="md:max-w-72 max-w-54 md:ml-6 my-4 border-violet-300 border-2" :src="'../photos/'+wpis.img" onerror="this.src='../src/assets/placeholder.png'">
                </div>
            </router-link>
        </div>
        <div v-if="post_limit >= wpisy.length">
            <br/><br/><br/><br/>
        </div>
        <div v-if="post_limit < wpisy.length" @click="post_limit += 20" class="mx-6 lg:mx-8 rounded-md mb-20 cursor-pointer text-white dark:text-slate-200 bg-violet-300 float-left p-3 px-8 dark:bg-indigo-900">Więcej</div>
    </div>
</template>

<style>
    .wpis:hover img{
        border-color: #a78bfa;
    }
    .dark .multiselect-dropdown{
        background: #2f2c5c;
        border: 1px solid #3f3d6d;
    }
    select{
        outline: none;
    }
</style>