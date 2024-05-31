<script setup>
  import { RouterLink, RouterView, useRoute } from 'vue-router'
  import Nav from './components/Nav.vue'
  const route = useRoute()
</script>

<template>
  <Nav :url="route.name" />
  <RouterView />
</template>