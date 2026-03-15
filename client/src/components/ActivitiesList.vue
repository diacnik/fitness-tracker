<script setup lang="ts">
import ActivityBox from './ActivityBox.vue';


</script>

<template>
  <section>
    <div class="container">
      <div>
        <ActivityBox
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        class="mb-4"
        />
      </div>
    </div>
  </section>
  <div>

  </div>
</template>

<style scoped>

</style>
