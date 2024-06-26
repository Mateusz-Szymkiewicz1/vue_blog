<script setup>
  import {ref, onUpdated} from 'vue'
  import { useRouter } from 'vue-router'
  import DashboardBlog from '../components/DashboardBlog.vue'
  import DashboardKonto from '../components/DashboardKonto.vue'
  const router = useRouter()
  const current_page = ref("blog")
  const user = ref("")
  fetch("http://localhost:3000/logowanie", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(res => {
      if(res.text){
        router.replace("/")
      }else{
        user.value = res
      }
  })
  const change_side = (side) => {
    current_page.value = side
    if(localStorage.getItem("vue_blog_cookies")){
      localStorage.setItem("vue_blog_dashboard_side", current_page.value);
    }
  }
  if(localStorage.getItem("vue_blog_dashboard_side")){
    current_page.value = localStorage.getItem("vue_blog_dashboard_side")
  }
</script>

<template>
  <div v-if="user">
    <h1 class="text-center font-semibold text-gray-900 text-4xl mt-16 dark:text-slate-200">Panel Zarządzania</h1>
    <div class="w-auto dark:bg-neutral-900 bg-violet-100 dark:text-slate-200 m-10">
      <div class="bg-violet-200 text-2xl dark:bg-neutral-800 h-14 flex items-center">
        <span @click="change_side('blog')" class="h-full cursor-pointer flex items-center px-3" :class="current_page == 'blog' ? 'text-violet-700' : null"><i class="fa fa-book mr-2"></i>Blog</span>
        <span @click="change_side('konto')" class="h-full cursor-pointer flex items-center px-3" :class="current_page == 'konto' ? 'text-violet-700' : null"><i class="fa fa-user mr-2"></i>Konto</span>
      </div>
      <DashboardBlog v-if="current_page == 'blog'"></DashboardBlog>
      <DashboardKonto v-if="current_page == 'konto'" :user="user"></DashboardKonto>
    </div>
  </div>
</template>