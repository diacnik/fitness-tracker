<script setup lang="ts">
import { useUserStore } from '../stores/user'
</script>

<template>
  <h1 class="title is-2">Admin Dashboard</h1>
  <div>
    <ul>
      <li v-for="user in useUserStore().users" :key="user.userId">
        {{ user.firstName }} {{ user.lastName }} (@{{ user.username }})
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
