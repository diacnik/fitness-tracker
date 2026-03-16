<script setup lang="ts">
import ActivitiesList from '@/components/ActivitiesList.vue';
import StatBox from '@/components/StatBox.vue';
</script>

<template>
  <section>
    <div class="container">
      <div class="is-flex is-justify-content-center is-align-items-center mb-4">
        <h1 class="title is-2 mb-0 has-text-centered">My Stats</h1>
      </div>
      <div>
        <StatBox />
      </div>

      <div class="is-flex is-justify-content-center is-align-items-center mb-4 recent-workout-header">
        <h1 class="title is-2 mb-0 has-text-centered">Most Recent Workout</h1>
      </div>

      <ActivitiesList filter-mode="current" :limit="1" />
    </div>
  </section>
</template>

<style scoped>
.recent-workout-header {
  margin-top: 2.5rem;
}
</style>
