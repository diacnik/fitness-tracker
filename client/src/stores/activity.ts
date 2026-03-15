import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import activitiesData from '../data/activities.json'
import usersData from '../data/users.json'
import type { Activity, User } from '../types'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>(activitiesData as Activity[])
  const users = ref<User[]>(usersData)

  function addActivity(newActivity: Omit<Activity, 'id'>) {
    const nextId = activities.value.length
      ? Math.max(...activities.value.map(activity => activity.id)) + 1
      : 1

    activities.value.unshift({
      id: nextId,
      ...newActivity,
    })
  }

  const activitiesWithUsers = computed(() =>
    activities.value.map(activity => ({
      activity,
      user: users.value.find(u => u.userId === activity.userId) as User,
    }))
  )

  return { activities, users, activitiesWithUsers, addActivity }
})
