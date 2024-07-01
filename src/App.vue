<script setup>
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import { ref } from 'vue'
  import Nav from './components/Nav.vue'
  import Footer from './components/Footer.vue'
  import CookieAlert from './components/CookieAlert.vue'
  const route = useRoute()
  const theme = ref("light")
  const show_cookie_alert = ref(false)
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
</script>

<template>
  <div id="container" class="dark:bg-neutral-950 bg-white">
    <Nav :url="route.name" :theme="theme" @themeSwitch="toggleTheme"></Nav>
    <RouterView/>
    <Footer></Footer>
    <CookieAlert></CookieAlert>
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