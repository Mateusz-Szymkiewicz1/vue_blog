<script setup>
    import { ref } from 'vue'
    const wpisy = ref([])
    fetch('http://localhost:3000/posty').then(res => res.json()).then(res => {
        res.forEach(el => {
            el.data = el.data.slice(0, 10)
            wpisy.value.push(el)
        })
    })
</script>

<template>
    <div class="container mt-7 flex flex-wrap p-6 lg:px-8 gap-6 items-center">
        <a v-for="wpis in wpisy" :href="'/post/'+wpis.id">
            <div class="wpis max-w-[600px] py-2 px-5 bg-violet-200 cursor-pointer hover:translate-y-[-2px] transition">
                <h3 class="text-2xl text-slate-800 font-bold mt-3">{{ wpis.tytul }} <span class="text-lg font-normal text-slate-600 ml-1">{{ wpis.data }}</span></h3>
                <img v-if="wpis.img" class="max-w-96 my-3 mt-8" :src="'../src/assets/photos/'+wpis.img">
                <p class="my-2 mt-7 text-slate-600">{{ wpis.tresc.slice(0, 200)+"..." }}</p>
            </div>
        </a>
    </div>
</template>