<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
</script>
<template>
  <NavBar v-if="route.name !== 'landing'" />
  <div class="container mt-5">
    <RouterView />
  </div>
</template>

<style scoped></style>
