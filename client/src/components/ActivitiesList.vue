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
    limit?: number
  }>(),
  {
    filterMode: 'current',
    limit: undefined,
  },
)

const filteredActivities = computed(() => {
  const currentUserId = userStore.currentUserId

  if (currentUserId === null) {
    return []
  }

  const activities = props.filterMode === 'others'
    ? activityStore.activitiesWithUsers.filter(
      ({ activity }) => activity.userId !== currentUserId,
    )
    : activityStore.activitiesWithUsers.filter(
      ({ activity }) => activity.userId === currentUserId,
    )

  const sortedActivities = [...activities].sort((a, b) => {
    const aDate = new Date(`${a.activity.date}T${a.activity.time || '00:00'}`).getTime()
    const bDate = new Date(`${b.activity.date}T${b.activity.time || '00:00'}`).getTime()

    return bDate - aDate
  })

  if (props.limit === undefined || props.limit <= 0) {
    return sortedActivities
  }

  return sortedActivities.slice(0, props.limit)
})

const hasActivities = computed(() => filteredActivities.value.length > 0)
const emptyStateLabel = computed(() =>
  props.filterMode === 'others' ? 'No activities from others yet.' : 'No activities yet.',
  )
</script>

<template>
  <section>
    <div class="container activity-feed">
      <div v-if="hasActivities">
        <ActivityBox
          v-for="{ activity, user } in filteredActivities"
          :key="activity.id"
          :activity="activity"
          :user="user"
          :show-actions="props.filterMode !== 'others'"
          class="mb-4"
        />
      </div>
      <p v-else class="has-text-grey">{{ emptyStateLabel }}</p>
    </div>
  </section>
</template>

<style scoped>
.activity-feed {
  max-width: 720px;
  margin: 0 auto;
}

</style>
