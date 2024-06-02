<script setup>
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import Nav from './components/Nav.vue'
  import Footer from './components/Footer.vue'
  const route = useRoute()
</script>

<template>
  <Nav :url="route.name"></Nav>
  <RouterView />
  <Footer></Footer>
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