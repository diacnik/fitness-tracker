<script setup lang="ts">
import ActivitiesList from '../components/ActivitiesList.vue'

</script>

<template>
  <section>
    <div class="container">
      <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h1 class="title is-2 mb-0">Friends' Activities</h1>
      </div>
      <ActivitiesList filter-mode="others" />
    </div>
  </section>
</template>

<style scoped>

</style>
