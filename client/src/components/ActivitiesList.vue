<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useActivityStore } from '../stores/activity'
import { useSessionStore } from '../stores/session'
import ActivityBox from './ActivityBox.vue'

const activityStore = useActivityStore()
const sessionStore = useSessionStore()
// Props for filtering user/other and limiting activities shown
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

onMounted(() => {
  activityStore.loadActivities()
})

const filteredActivities = computed(() => {
  const currentUserId = sessionStore.user?.id

  if (!currentUserId) {
    return []
  }

  // Filter out user activities if others or only user activities if current
  const activities = props.filterMode === 'others'
    ? activityStore.activities.filter(
      (activity) => activity.userId !== currentUserId,
    )
    : activityStore.activities.filter(
      (activity) => activity.userId === currentUserId,
    )

  const sortedActivities = [...activities].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
    const bDate = new Date(`${b.date}T${b.time || '00:00'}`).getTime()

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
          v-for="activity in filteredActivities"
          :key="activity.id"
          :activity="activity"
          :user="sessionStore.user"
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
