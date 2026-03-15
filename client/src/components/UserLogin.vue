<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'
import type { User } from '../types'

const userStore = useUserStore()

const users = computed(() => userStore.users)
const currentUser = computed(() => userStore.currentUser)
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleLogin = (user: User) => {
  userStore.setCurrentUser(user.userId)
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
      {{ currentUser ? `Logged in as ${currentUser.username}` : 'Login' }}
      <span class="caret" :class="{ open: isOpen }" aria-hidden="true">▾</span>
    </button>

    <ul v-if="isOpen" class="login-menu" role="menu" aria-label="Select user">
      <li v-for="user in users" :key="user.userId" role="none">
        <button
          type="button"
          class="menu-item"
          :class="{ active: currentUser?.userId === user.userId }"
          role="menuitem"
          @click="handleLogin(user)"
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
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #111827;
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
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.16);
  z-index: 20;
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

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item.active {
  background: #e5e7eb;
}

.menu-item small {
  display: block;
  color: #6b7280;
  font-size: 0.78rem;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
}

</style>
