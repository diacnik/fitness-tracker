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
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
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

      <div class="navbar-item has-dropdown is-hoverable">
        <RouterLink to="/my-activity" class="navbar-link">
          My Activity
        </RouterLink>

        <div class="navbar-dropdown">
          <RouterLink to="/stats" class="navbar-item">
            Stats
          </RouterLink>
        </div>
      </div>

      <RouterLink to="/connections" class="navbar-item">
        Connections
      </RouterLink>

      <div v-if="currentUser?.isAdmin" class="navbar-item is-hoverable">
        <RouterLink to="/admin" class="navbar-item">
          Admin
        </RouterLink>
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

          <a v-if="!currentUser" class="button is-link">
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
.navbar {
  border-bottom: 3px solid var(--bulma-orange, #ff8a00);
}

.navbar-menu {
  flex-grow: 1;
}

.navbar-item.has-dropdown .navbar-dropdown {
  display: none;
}

.navbar-item.has-dropdown.is-hoverable:hover .navbar-dropdown,
.navbar-item.has-dropdown:has(.navbar-link.router-link-active) .navbar-dropdown,
.navbar-item.has-dropdown:has(.navbar-dropdown .router-link-active) .navbar-dropdown {
  display: block;
}

@media screen and (min-width: 1024px) {
  .navbar-menu {
    display: flex;
    align-items: stretch;
  }

  .navbar-start {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
  }

  .navbar-end {
    flex: 0 0 auto;
    margin-left: auto;
  }

  .navbar-start > .navbar-item,
  .navbar-start > .navbar-item.has-dropdown {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    justify-content: center;
  }

  .navbar-start .navbar-link,
  .navbar-start > .navbar-item {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .buttons {
    justify-content: flex-end;
  }
}

.current-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  color: var(--bulma-white, #ffffff);
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
