<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import MessageList from '@/components/MessageList.vue'

const route = useRoute()
</script>
<template>
  <NavBar v-if="route.name !== 'landing'" />
  <div class="container mt-5">
    <MessageList />
    <RouterView />
  </div>
</template>

<style scoped></style>
