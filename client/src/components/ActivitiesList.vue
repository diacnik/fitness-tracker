<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useActivityStore } from '../stores/activity'
import { useSessionStore } from '../stores/session'
import { useConnectionStore } from '../stores/connections'
import type { User, DataListEnvelope } from '../../../server/types'
import ActivityBox from './ActivityBox.vue'

const activityStore = useActivityStore()
const sessionStore = useSessionStore()
const connectionStore = useConnectionStore()

const activitiesUsers = ref<Map<number, User>>(new Map())
// Props for filtering user/other and limiting activities shown
const props = withDefaults(
  defineProps<{
    filterMode?: 'current' | 'others' | 'connections'
    limit?: number
  }>(),
  {
    filterMode: 'current',
    limit: undefined,
  },
)

onMounted(async () => {
  activityStore.loadActivities()

  if (props.filterMode === 'connections' && sessionStore.user) {
    connectionStore.loadForUser(sessionStore.user.id)
  }

  if (props.filterMode !== 'current') {
    try {
      const response = await sessionStore.api<DataListEnvelope<User>>('users')
      const userMap = new Map<number, User>()
      response.data.forEach(user => userMap.set(user.id, user))
      activitiesUsers.value = userMap
    } catch (e) {
      console.error('Failed to load users for activities', e)
    }
  }
})

const getUserForActivity = (userId: number) => {
  if (props.filterMode === 'current' || sessionStore.user?.id === userId) {
    return sessionStore.user
  }
  return activitiesUsers.value.get(userId) || null
}

const filteredActivities = computed(() => {
  const currentUserId = sessionStore.user?.id

  if (!currentUserId) {
    return []
  }

  // Filter out user activities if others or only user activities if current
  let activities = activityStore.activities;
  if (props.filterMode === 'others') {
    activities = activities.filter((activity) => activity.userId !== currentUserId)
  } else if (props.filterMode === 'connections') {
    const connectionIds = new Set(
      connectionStore.connections.map(c => c.userId === currentUserId ? c.friendId : c.userId)
    )
    activities = activities.filter((activity) => connectionIds.has(activity.userId))
  } else {
    activities = activities.filter((activity) => activity.userId === currentUserId)
  }

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
const emptyStateLabel = computed(() => {
  if (props.filterMode === 'others') return 'No activities from others yet.'
  if (props.filterMode === 'connections') return 'No activities from connections yet.'
  return 'No activities yet.'
})
</script>

<template>
  <section>
    <div class="container activity-feed">
      <div v-if="hasActivities">
        <ActivityBox
          v-for="activity in filteredActivities"
          :key="activity.id"
          :activity="activity"
          :user="getUserForActivity(activity.userId)"
          :show-actions="props.filterMode === 'current'"
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
