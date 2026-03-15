<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const sortedUsers = computed(() => {
  return [...userStore.users].sort((a, b) => {
    if (a.isAdmin !== b.isAdmin) {
      return a.isAdmin ? -1 : 1
    }

    return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
  })
})
</script>

<template>
  <section class="users-list">
    <h2 class="title is-4">Users</h2>

    <ul class="users-grid">
      <li v-for="user in sortedUsers" :key="user.userId" class="user-card">
        <img
          :src="user.profilePicture"
          :alt="`${user.firstName} ${user.lastName}`"
          class="user-avatar"
        />

        <div class="user-meta">
          <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="user-username">@{{ user.username }}</p>
        </div>

        <span v-if="user.isAdmin" class="tag is-warning is-light">Admin</span>

        <div class="user-actions">
          <button type="button" class="button is-small">Edit</button>
          <button type="button" class="button is-small is-danger is-light">Delete</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.users-list {
  max-width: 720px;
  margin: 0 auto;
}

.users-grid {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.75rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #dbdbdb;
  border-radius: 0.75rem;
  background: #fff;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.user-meta {
  flex: 1;
}

.user-name {
  margin: 0;
  font-weight: 600;
}

.user-username {
  margin: 0.1rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

</style>
