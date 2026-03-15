<script setup lang="ts">
import { computed } from 'vue'
import { useActivityStore } from '../stores/activity'
import { useUserStore } from '../stores/user'
import ActivityBox from './ActivityBox.vue'

const activityStore = useActivityStore()
const userStore = useUserStore()
const props = withDefaults(
  defineProps<{
    filterMode?: 'current' | 'others'
  }>(),
  {
    filterMode: 'current',
  },
)

const filteredActivities = computed(() => {
  const currentUserId = userStore.currentUserId

  if (currentUserId === null) {
    return []
  }

  if (props.filterMode === 'others') {
    return activityStore.activitiesWithUsers.filter(
      ({ activity }) => activity.userId !== currentUserId,
    )
  }

  return activityStore.activitiesWithUsers.filter(
    ({ activity }) => activity.userId === currentUserId,
  )
})
</script>

<template>
  <section>
    <div class="container activity-feed">
      <div>
        <ActivityBox
          v-for="{ activity, user } in filteredActivities"
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
