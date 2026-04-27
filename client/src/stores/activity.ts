import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { DataEnvelope, DataListEnvelope, Activity } from '../../../server/types'
import useSessionStore from './session'

export const useActivityStore = defineStore('activity', () => {
  const session = useSessionStore();
  const activities = ref<Activity[]>([]);

  async function loadActivities() {
    const data = await session.api<DataListEnvelope<Activity>>('activities');
    activities.value = data.data;
  }

  async function getActivity(id: number) {
    return session.api<DataEnvelope<Activity>>(`activities/${id}`);
  }

  async function createActivity(activity: Omit<Activity, 'id'>) {
    const data = await session.api<DataEnvelope<Activity>>('activities', activity);
    activities.value.push(data.data);
    return data;
  }

  async function updateActivity(id: number, activity: Omit<Activity, 'id'>) {
    const data = await session.api<DataEnvelope<Activity>>(`activities/${id}`, activity, { method: 'PATCH' });
    const index = activities.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      activities.value[index] = data.data;
    }
    return data;
  }

  async function deleteActivity(id: number) {
    const data = await session.api<DataEnvelope<null>>(`activities/${id}`, null, { method: 'DELETE' });
    const index = activities.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      activities.value.splice(index, 1);
    }
    return data;
  }

  return {
    activities,
    loadActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
  }
})
