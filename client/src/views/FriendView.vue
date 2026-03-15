<script setup lang="ts">
import UserSearch from '@/components/UserSearch.vue';
import ActivitiesList from '../components/ActivitiesList.vue'

</script>

<template>
  <section>
    <div class="container">
      <div class="friends-layout">
        <div class="search-column">
          <UserSearch />
        </div>

        <div class="activities-column">
          <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <h1 class="title is-2 mb-0">Friends' Activities</h1>
          </div>
          <ActivitiesList filter-mode="others" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.friends-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  align-items: start;
}

.search-column,
.activities-column {
  min-width: 0;
}

.search-column :deep(.user-search),
.activities-column :deep(.activity-feed) {
  max-width: none;
  margin: 0;
}

@media (max-width: 1023px) {
  .friends-layout {
    grid-template-columns: 1fr;
  }
}

</style>
