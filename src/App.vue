<script setup>
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import { ref, watch } from 'vue'
  import Nav from './components/Nav.vue'
  import Footer from './components/Footer.vue'
  import CookieAlert from './components/CookieAlert.vue'
  import Toast from './components/Toast.vue'
  const route = useRoute()
  const theme = ref("light")
  const show_cookie_alert = ref(false)
  const reload = ref(false)

  const toggleTheme = () => {
      if(theme.value == "light"){
        theme.value = "dark"
        document.querySelector("html").className = "dark"
      }else{
        theme.value = "light"
        document.querySelector("html").className = ""
      }
      if(localStorage.getItem("vue_blog_cookies")){
        localStorage.setItem("vue_blog_theme", theme.value);
      }
  }
  if(localStorage.getItem("vue_blog_theme") && localStorage.getItem("vue_blog_theme") == "dark"){
    theme.value = "dark"
    document.querySelector("html").className = "dark"
  }

  const toast = ref({})
  const show_toast = (obj) => {
    toast.value = obj
  }
  
  watch(route, () => {
    if(!route.query.toast){
      toast.value = {}
    }
    if(route.query.reload){
      reload.value = !reload.value
    }
  })
</script>

<template>
  <div id="container" class="dark:bg-neutral-950 bg-white">
    <Nav :key="reload" :url="route.name" :theme="theme" @themeSwitch="toggleTheme"></Nav>
    <RouterView :key="reload" @toast="show_toast"/>
    <Footer></Footer>
    <CookieAlert></CookieAlert>
    <Toast :toast="toast" @closeToast="toast = {}"></Toast>
  </div>
</template>

<style>
  #container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  footer {
    margin-top: auto;
  }
</style>