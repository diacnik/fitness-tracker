import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import activitiesData from '../data/activities.json'
import usersData from '../data/users.json'
import type { Activity, User } from '../types'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>(activitiesData as Activity[])
  const users = ref<User[]>(usersData)

  const activitiesWithUsers = computed(() =>
    activities.value.map(activity => ({
      activity,
      user: users.value.find(u => u.userId === activity.userId) as User,
    }))
  )

  return { activities, users, activitiesWithUsers }
})
