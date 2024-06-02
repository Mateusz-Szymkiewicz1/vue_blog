<script setup>
    import { ref, watch } from 'vue'
    import Multiselect from '@vueform/multiselect'
    const wpisy = ref([])
    const wpisy_backup = ref([])
    const error = ref("")
    const search = ref("")
    const tags = ref([])
    const selected_tags = ref([])

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
    })
</script>

<template>
    <main v-if="error" class="grid min-h-[70vh] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div class="text-center">
            <p class="text-6xl font-semibold text-violet-600">500</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Błąd serwera</h1>
            <p class="mt-6 leading-7 text-gray-600">Przepraszamy, nie uzyskaliśmy połączenia z serwerem.</p>
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
            <input type="search" v-model="search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-violet-100 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..."/>
        </div>
        <Multiselect class="md:mt-16 mt-4 max-w-72 !p-0 !text-sm !text-gray-400 !h-[38px] !bg-violet-100 rounded-lg border border-gray-300" :max="5" :limit="10" mode="tags" placeholder="Tags" v-model="selected_tags" :options="tags">
       <template v-slot:option="{ option }">
         <span class="p-1 w-full px-2 font-normal bg-violet-50 hover:bg-violet-100">{{ option.value }}</span>
       </template>
    </Multiselect>
    </div>
        <div class="container my-5 flex flex-wrap p-6 pt-0 lg:px-8 gap-6 min-h-96">
            <router-link v-for="wpis in wpisy" :to="'/post/'+wpis.id">
                <div class="wpis md:flex md:h-64 py-2 px-5 bg-violet-200 cursor-pointer hover:bg-violet-300 transition-all  duration-300 hover:translate-y-[-2px]">
                    <div class="max-w-[400px]">
                        <h3 class="text-2xl text-slate-800 font-bold mt-3">{{ wpis.tytul }}<span class="text-lg font-normal text-slate-600 ml-2 whitespace-nowrap">{{ wpis.data }}</span></h3>
                        <p class="mt-5">
                            <span v-for="tag in wpis.tagi" class="rounded-md bg-purple-50 px-2 py-1 text-sm text-purple-700 ring-1 ring-inset ring-purple-700/10 mr-2">{{ tag }}</span>
                        </p>
                        <p class="my-2 mt-4 text-slate-600">{{ wpis.tresc.slice(0, 200)+"..." }}</p>
                    </div>
                    <img v-if="wpis.img" class="md:max-w-72 max-w-54 md:ml-6 my-4 border-violet-300 border-2" :src="'../src/assets/photos/'+wpis.img" onerror="this.onerror=null; this.src='../src/assets/placeholder.png'">
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
    .wpis:hover img{
        border-color: #a78bfa;
    }
</style>