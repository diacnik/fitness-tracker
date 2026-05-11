<script setup lang="ts">
import UsersList from '@/components/UsersList.vue'
import AdminConnectionsList from '@/components/AdminConnectionsList.vue'
import AdminActivitiesList from '@/components/AdminActivitiesList.vue'
</script>

<template>
  <div class="admin-header">
    <h1 class="title is-2">Admin Dashboard</h1>
  </div>
  <section class="admin-layout">
    <div class="admin-column">
      <UsersList />
    </div>
    <div class="admin-column">
      <AdminConnectionsList />
    </div>
    <div class="admin-column">
      <AdminActivitiesList />
    </div>
  </section>
</template>

<style scoped>
.admin-header {
  max-width: 720px;
  margin: 0 auto 1.5rem;
  text-align: center;
}

.admin-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  align-items: start;
}

.admin-column {
  min-width: 0;
}

@media (max-width: 1024px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }
}
</style>
