<script setup lang="ts">
import { computed } from 'vue'
import { useActivityStore } from '../stores/activity'
import { useUserStore } from '../stores/user'

type PeriodTotals = {
  week: number
  month: number
  allTime: number
}

const activityStore = useActivityStore()
const userStore = useUserStore()

function getDateBoundaries(now: Date) {
  const weekStart = new Date(now)
  weekStart.setHours(0, 0, 0, 0)

  const dayOfWeek = weekStart.getDay()
  const diffFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  weekStart.setDate(weekStart.getDate() - diffFromMonday)

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)

  return {
    weekStart,
    monthStart,
  }
}

function getCurrentUserActivities() {
  const currentUserId = userStore.currentUserId

  if (currentUserId === null) {
    return []
  }

  return activityStore.activities.filter(activity => activity.userId === currentUserId)
}

function getTotalDistanceByPeriod(): PeriodTotals {
  const now = new Date()
  const { weekStart, monthStart } = getDateBoundaries(now)

  return getCurrentUserActivities().reduce<PeriodTotals>(
    (totals, activity) => {
      const activityDate = new Date(`${activity.date}T00:00:00`)

      totals.allTime += activity.distance

      if (activityDate >= monthStart && activityDate <= now) {
        totals.month += activity.distance
      }

      if (activityDate >= weekStart && activityDate <= now) {
        totals.week += activity.distance
      }

      return totals
    },
    { week: 0, month: 0, allTime: 0 },
  )
}

function getTotalDurationByPeriod(): PeriodTotals {
  const now = new Date()
  const { weekStart, monthStart } = getDateBoundaries(now)

  return getCurrentUserActivities().reduce<PeriodTotals>(
    (totals, activity) => {
      const activityDate = new Date(`${activity.date}T00:00:00`)

      totals.allTime += activity.duration

      if (activityDate >= monthStart && activityDate <= now) {
        totals.month += activity.duration
      }

      if (activityDate >= weekStart && activityDate <= now) {
        totals.week += activity.duration
      }

      return totals
    },
    { week: 0, month: 0, allTime: 0 },
  )
}

function getWorkoutCountByPeriod(): PeriodTotals {
  const now = new Date()
  const { weekStart, monthStart } = getDateBoundaries(now)

  return getCurrentUserActivities().reduce<PeriodTotals>(
    (totals, activity) => {
      const activityDate = new Date(`${activity.date}T00:00:00`)

      totals.allTime += 1

      if (activityDate >= monthStart && activityDate <= now) {
        totals.month += 1
      }

      if (activityDate >= weekStart && activityDate <= now) {
        totals.week += 1
      }

      return totals
    },
    { week: 0, month: 0, allTime: 0 },
  )
}

const distanceTotals = computed(() => getTotalDistanceByPeriod())
const durationTotals = computed(() => getTotalDurationByPeriod())
const workoutTotals = computed(() => getWorkoutCountByPeriod())

defineExpose({
  getTotalDistanceByPeriod,
  getTotalDurationByPeriod,
  getWorkoutCountByPeriod,
})

</script>

<template>
  <div class="stats-grid">
    <article class="stat-card">
      <h3 class="stat-title">This Week</h3>
      <p class="stat-row"><span>Distance (mi)</span><strong>{{ distanceTotals.week.toFixed(1) }}</strong></p>
      <p class="stat-row"><span>Duration (min)</span><strong>{{ durationTotals.week }}</strong></p>
      <p class="stat-row"><span>Workouts</span><strong>{{ workoutTotals.week }}</strong></p>
    </article>

    <article class="stat-card">
      <h3 class="stat-title">This Month</h3>
      <p class="stat-row"><span>Distance (mi)</span><strong>{{ distanceTotals.month.toFixed(1) }}</strong></p>
      <p class="stat-row"><span>Duration (min)</span><strong>{{ durationTotals.month }}</strong></p>
      <p class="stat-row"><span>Workouts</span><strong>{{ workoutTotals.month }}</strong></p>
    </article>

    <article class="stat-card">
      <h3 class="stat-title">All-Time</h3>
      <p class="stat-row"><span>Distance (mi)</span><strong>{{ distanceTotals.allTime.toFixed(1) }}</strong></p>
      <p class="stat-row"><span>Duration (min)</span><strong>{{ durationTotals.allTime }}</strong></p>
      <p class="stat-row"><span>Workouts</span><strong>{{ workoutTotals.allTime }}</strong></p>
    </article>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.stat-card {
  background: var(--bulma-scheme-main, #ffffff);
  border: 1px solid var(--bulma-border, #d7deea);
  border-radius: 14px;
  box-shadow: 0 10px 24px var(--bulma-shadow, rgba(29, 45, 68, 0.08));
  padding: 1rem;
}

.stat-title {
  color: var(--bulma-text-strong, #1d2d44);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}

.stat-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0.4rem 0;
}

.stat-row span {
  color: var(--bulma-text-weak, #5f6c7b);
  font-size: 0.92rem;
}

.stat-row strong {
  color: var(--bulma-text-strong, #0f172a);
  font-size: 1rem;
}

</style>
