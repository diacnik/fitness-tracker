import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import activitiesData from '../data/activities.json'
import { useUserStore } from './user'
import type { Activity } from '../types'

export const useActivityStore = defineStore('activity', () => {
  const userStore = useUserStore()
  const activities = ref<Activity[]>(activitiesData as Activity[])
  const users = computed(() => userStore.users)

  function addActivity(newActivity: Omit<Activity, 'id'>) {
    const nextId = activities.value.length
      ? Math.max(...activities.value.map(activity => activity.id)) + 1
      : 1

    activities.value.unshift({
      id: nextId,
      ...newActivity,
    })
  }

  function deleteActivitiesByUser(userId: number) {
    activities.value = activities.value.filter(activity => activity.userId !== userId)
  }

  const activitiesWithUsers = computed(() =>
    activities.value
      .map(activity => {
        const user = users.value.find(currentUser => currentUser.userId === activity.userId)

        if (!user) {
          return null
        }

        return {
          activity,
          user,
        }
      })
      .filter(item => item !== null)
  )

  return { activities, users, activitiesWithUsers, addActivity, deleteActivitiesByUser }
})
