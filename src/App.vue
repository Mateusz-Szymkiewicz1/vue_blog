<script setup>
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import { ref } from 'vue'
  import Nav from './components/Nav.vue'
  import Footer from './components/Footer.vue'
  const route = useRoute()
  const theme = ref("light")
  const toggleTheme = () => {
      if(theme.value == "light"){
        theme.value = "dark"
      }else{
        theme.value = "light"
      }
  }
</script>

<template>
  <div :class="theme">
    <Nav :url="route.name" :theme="theme" @themeSwitch="toggleTheme"></Nav>
    <RouterView />
    <Footer></Footer>
  </div>
</template>

<style>
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  footer {
    margin-top: auto;
  }
</style>