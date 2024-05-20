<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'

  const route = useRoute()
  const id = route.params.id
</script>

<template>
  <div class="post">
    <h1>To jest post {{ id }}</h1>
  </div>
</template>