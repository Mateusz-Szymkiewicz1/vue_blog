<script setup>
    import { ref } from 'vue'

    const wpisy = ref([])
    wpisy.value.push({
        title: "Lorem ipsum dolor sit amet!",
        date: "19.05.2024",
        tagi: ['humor'],
        tresc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rerum quibusdam incidunt explicabo ab consectetur recusandae ea sunt natus. Suscipit quasi, doloribus dignissimos iste delectus error modi pariatur...",
    })
    wpisy.value.push({
        title: "Lorem ipsum dolor sit amet!",
        date: "19.05.2024",
        tagi: ['humor'],
        tresc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rerum quibusdam incidunt explicabo ab consectetur recusandae ea sunt natus. Suscipit quasi, doloribus dignissimos iste delectus error modi pariatur..."
    })
    wpisy.value.push({
        title: "Lorem ipsum dolor sit amet!",
        date: "19.05.2024",
        tagi: ['humor'],
        tresc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rerum quibusdam incidunt explicabo ab consectetur recusandae ea sunt natus. Suscipit quasi, doloribus dignissimos iste delectus error modi pariatur..."
    })
    wpisy.value.push({
        title: "Lorem ipsum dolor sit amet!",
        date: "19.05.2024",
        tagi: ['humor'],
        tresc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto rerum quibusdam incidunt explicabo ab consectetur recusandae ea sunt natus. Suscipit quasi, doloribus dignissimos iste delectus error modi pariatur..."
    })
</script>

<template>
    <div class="container mt-7 flex flex-wrap p-6 lg:px-8 gap-6 items-center">
        <div class="wpis max-w-[600px] py-2 px-5 bg-violet-200 cursor-pointer hover:translate-y-[-2px] transition" v-for="wpis in wpisy">
            <h3 class="text-2xl text-slate-800 font-bold mt-3">{{ wpis.title }} <span class="text-lg font-normal text-slate-600 ml-1">{{ wpis.date }}</span></h3>
            <img v-if="wpis.img" class="max-w-96 my-3 mt-8" :src="'../src/assets/photos/'+wpis.img">
            <p class="my-2 mt-7 text-slate-600">{{ wpis.tresc }}</p>
        </div>
    </div>
</template>