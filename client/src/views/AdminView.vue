<script setup lang="ts">
import UsersList from '@/components/UsersList.vue'
</script>

<template>
  <div class="admin-header">
    <h1 class="title is-2">Admin Dashboard</h1>
  </div>
  <UsersList />
</template>

<style scoped>
.admin-header {
  max-width: 720px;
  margin: 0 auto 1.5rem;
}
</style>
