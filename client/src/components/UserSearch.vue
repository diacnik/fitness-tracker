<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)

const query = ref('')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredUsers = computed(() => {
  if (!normalizedQuery.value) {
    return []
  }

  return users.value.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const username = user.username.toLowerCase()

    return fullName.includes(normalizedQuery.value) || username.includes(normalizedQuery.value)
  })
})

const hasQuery = computed(() => normalizedQuery.value.length > 0)

const clearQuery = () => {
  query.value = ''
}

</script>

<template>
  <section class="user-search">
    <h2 class="title is-4">Find Users</h2>

    <div class="search-row">
      <input
        v-model="query"
        type="search"
        class="input"
        placeholder="Search by name or username"
        aria-label="Search users"
      />
      <button
        v-if="hasQuery"
        type="button"
        class="button is-light"
        @click="clearQuery"
      >
        Clear
      </button>
    </div>

    <p class="search-meta">{{ filteredUsers.length }} user{{ filteredUsers.length === 1 ? '' : 's' }} found</p>

    <ul v-if="filteredUsers.length" class="results-list">
      <li v-for="user in filteredUsers" :key="user.userId" class="result-item">
        <img :src="user.profilePicture" :alt="`${user.username} profile picture`" class="avatar" />
        <div class="result-text">
          <p class="name">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="username">@{{ user.username }}</p>
        </div>
        <span v-if="user.isAdmin" class="tag is-warning is-light">Admin</span>
      </li>
    </ul>

    <p v-else-if="hasQuery" class="empty-state">No users match your search.</p>
  </section>
</template>

<style scoped>
.user-search {
  max-width: 640px;
  margin: 0 auto;
}

.search-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.75rem;
}

.search-row .input {
  flex: 1;
}

.search-meta {
  margin: 0.75rem 0 0;
  color: var(--bulma-text, #4b5563);
  font-size: 0.92rem;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0.85rem 0 0;
  display: grid;
  gap: 0.55rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--bulma-border, #e5e7eb);
  border-radius: 0.7rem;
  padding: 0.55rem 0.7rem;
  background: var(--bulma-scheme-main, #fff);
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.result-text {
  flex: 1;
}

.name {
  margin: 0;
  font-weight: 600;
}

.username {
  margin: 0.1rem 0 0;
  color: var(--bulma-text-weak, #6b7280);
  font-size: 0.9rem;
}

.empty-state {
  margin: 0.9rem 0 0;
  color: var(--bulma-text-weak, #6b7280);
}

@media (max-width: 640px) {
  .search-row {
    flex-direction: column;
  }
}

</style>
