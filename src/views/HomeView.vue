<script setup>
    import { ref } from 'vue'
    const wpisy = ref([])
    const error = ref("")
    fetch('http://localhost:3000/posty').then(res => res.json()).then(res => {
        if(res.status == 0){
            error.value = res.text
        }else{
            res.forEach(el => {
                el.data = el.data.slice(0, 10)
                if(el.tagi){
                    el.tagi = JSON.parse(el.tagi)
                }
                wpisy.value.push(el)
            })
        }
    })
</script>

<template>
    <div class="container mt-7 flex flex-wrap p-6 lg:px-8 gap-6">
        <p v-if="error" class="font-semibold text-2xl underline decoration-red-500">{{ error }}</p>
        <a v-for="wpis in wpisy" :href="'/post/'+wpis.id">
            <div class="wpis sm:flex sm:h-64 py-2 px-5 bg-violet-200 cursor-pointer hover:translate-y-[-2px] transition">
                <div class="max-w-[400px]">
                    <h3 class="text-2xl text-slate-800 font-bold mt-3">{{ wpis.tytul }}<span class="text-lg font-normal text-slate-600 ml-2 whitespace-nowrap">{{ wpis.data }}</span></h3>
                    <p class="mt-5">
                        <span v-for="tag in wpis.tagi" class="rounded-md bg-purple-50 px-2 py-1 text-sm text-purple-700 ring-1 ring-inset ring-purple-700/10 mr-2">{{ tag }}</span>
                    </p>
                    <p class="my-2 mt-4 text-slate-600">{{ wpis.tresc.slice(0, 200)+"..." }}</p>
                </div>
                <img v-if="wpis.img" class="sm:max-w-72 max-w-54 sm:ml-6 my-4 border-violet-300 border-2" :src="'../src/assets/photos/'+wpis.img" onerror="this.onerror=null; this.src='../src/assets/placeholder.png'">
            </div>
        </a>
    </div>
</template>

<style scoped>
</style>