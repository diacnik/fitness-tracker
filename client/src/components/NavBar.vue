<script setup lang="ts">

import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user';
import UserLogin from './UserLogin.vue';

const isActive = ref(false);
const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const logout = () => {
  userStore.clearCurrentUser();
};

</script>

<template>
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
  <div class="container">
    <div class="navbar-brand">
    <RouterLink to="/" class="navbar-item has-text-weight-semibold">
      Fitness Tracker
    </RouterLink>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
      @click="isActive = !isActive" :class="{ 'is-active': isActive }">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': isActive}">
    <div class="navbar-start">
      <RouterLink to="/" active-class="is-active" class="navbar-item">
        Home
      </RouterLink>

      <RouterLink to="/my-activity" class="navbar-item">
        My Activity
      </RouterLink>

      <RouterLink to="/stats" class="navbar-item">
        Stats
      </RouterLink>

      <RouterLink to="/friends-activity" class="navbar-item">
        Friends Activity
      </RouterLink>

      <RouterLink to="/people-search" class="navbar-item">
        People Search
      </RouterLink>

      <div v-if="currentUser?.isAdmin" class="navbar-item has-dropdown is-hoverable">
        <a to="/admin" class="navbar-link">
          Admin
        </a>

        <div class="navbar-dropdown">
          <RouterLink to="/users" class="navbar-item">
            Users
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div v-if="currentUser" class="current-user-pill">
            <img
              :src="currentUser.profilePicture"
              :alt="`${currentUser.username} profile picture`"
              class="current-user-avatar"
            />
            <span class="current-user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
          </div>

          <a v-if="!currentUser" class="button is-primary">
            <strong>Sign up</strong>
          </a>

          <UserLogin v-if="!currentUser" />

          <button v-else type="button" class="button is-light" @click="logout">
            Log out
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</nav>
</template>

<style scoped>
.current-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  color: #ffffff;
}

.current-user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  object-fit: cover;
}

.current-user-name {
  font-size: 0.85rem;
  font-weight: 600;
}

</style>
