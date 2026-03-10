<script setup lang="ts">

import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const isActive = ref(false);

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

      <div class="navbar-item has-dropdown is-hoverable">
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
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
  </div>
</nav>
</template>

<style scoped>

</style>
