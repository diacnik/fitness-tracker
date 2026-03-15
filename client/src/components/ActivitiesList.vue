<script setup lang="ts">
import { useActivityStore } from '../stores/activity'
import ActivityBox from './ActivityBox.vue'

const activityStore = useActivityStore()
</script>

<template>
  <section>
    <div class="container activity-feed">
      <div>
        <ActivityBox
          v-for="{ activity, user } in activityStore.activitiesWithUsers"
          :key="activity.id"
          :activity="activity"
          :user="user"
          class="mb-4"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.activity-feed {
  max-width: 720px;
  margin: 0 auto;
}

</style>
