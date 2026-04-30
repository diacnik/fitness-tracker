<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSessionStore } from '../stores/session'
import type { User, DataListEnvelope } from '../../../server/types'

const sessionStore = useSessionStore()
const users = ref<User[]>([])

const isOpen = ref(false)

onMounted(async () => {
  try {
    const response = await sessionStore.api<DataListEnvelope<User>>('users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleLogin = (user: User) => {
  sessionStore.user = user
  isOpen.value = false
}
</script>

<template>
  <div class="user-login" @keydown.esc="isOpen = false">
    <button
      type="button"
      class="login-button"
      @click="toggleMenu"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
    >
      {{ sessionStore.user ? `Logged in as ${sessionStore.user.username}` : 'Login' }}
      <span class="caret" :class="{ open: isOpen }" aria-hidden="true">▾</span>
    </button>

    <ul v-if="isOpen" class="login-menu" role="menu" aria-label="Select user">
      <li v-for="user in users" :key="user.id" role="none">
        <button
          type="button"
          class="menu-item"
          :class="{ active: sessionStore.user?.id === user.id }"
          role="menuitem"
          @mousedown.prevent
          @click.stop="handleLogin(user)"
        >
          <img :src="user.profilePicture" :alt="`${user.username} profile picture`" class="avatar" />
          <span>{{ user.firstName }} {{ user.lastName }}</span>
          <small>@{{ user.username }}</small>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.user-login {
  position: relative;
  display: inline-block;
}

.login-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--bulma-border, #d1d5db);
  border-radius: 0.5rem;
  background: var(--bulma-scheme-main, #ffffff);
  color: var(--bulma-text-strong, #111827);
  padding: 0.55rem 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.caret {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.caret.open {
  transform: rotate(180deg);
}

.login-menu {
  position: absolute;
  right: 0;
  margin-top: 0.45rem;
  width: 280px;
  max-height: 260px;
  overflow-y: auto;
  list-style: none;
  padding: 0.4rem;
  border: 1px solid var(--bulma-border, #e5e7eb);
  border-radius: 0.75rem;
  background: var(--bulma-scheme-main, #ffffff);
  box-shadow: 0 12px 30px var(--bulma-shadow, rgba(17, 24, 39, 0.16));
  z-index: 100;
}

.menu-item {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.55rem;
  border: 0;
  background: transparent;
  border-radius: 0.5rem;
  padding: 0.45rem;
  cursor: pointer;
  text-align: left;
}

.menu-item span {
  color: var(--bulma-text-strong, #111827);
  font-weight: 600;
}

.menu-item:hover {
  background: var(--bulma-scheme-main-bis, #f3f4f6);
}

.menu-item.active {
  background: var(--bulma-scheme-main-ter, #e5e7eb);
}

.menu-item small {
  display: block;
  color: var(--bulma-text-weak, #6b7280);
  font-size: 0.78rem;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
}

</style>
