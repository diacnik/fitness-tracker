<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useActivityStore } from '@/stores/activity'
import { useSessionStore } from '@/stores/session'
import type { Activity, ActivityCategory, DataListEnvelope, User } from '../../../server/types'

type ActivityRow = Activity & {
  userName: string
}

const sessionStore = useSessionStore()
const activityStore = useActivityStore()

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const savingId = ref<number | null>(null)
const editingActivityId = ref<number | null>(null)
const categoryOptions: ActivityCategory[] = ['run', 'climb', 'bike', 'other', 'hike']
const editForm = reactive({
  date: '',
  time: '',
  description: '',
  category: 'run' as ActivityCategory,
  distance: 0,
  duration: 0,
  image: '',
})

async function loadUsers() {
  const response = await sessionStore.api<DataListEnvelope<User>>('users')
  users.value = response.data
}

async function loadActivities() {
  await activityStore.loadActivities()
}

async function load() {
  if (!sessionStore.user) return

  try {
    isLoading.value = true
    error.value = null
    await Promise.all([loadActivities(), loadUsers()])
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    isLoading.value = false
  }
}

const usersById = computed(() => {
  return new Map(users.value.map((user) => [user.id, user]))
})

const activityRows = computed<ActivityRow[]>(() => {
  const lookup = usersById.value

  return activityStore.activities.map((activity) => {
    const user = lookup.get(activity.userId)

    return {
      ...activity,
      userName: user ? `${user.firstName} ${user.lastName}` : `User #${activity.userId}`,
    }
  })
})

function onRetry() {
  void load()
}

function startEditing(activity: Activity) {
  editingActivityId.value = activity.id
  editForm.date = activity.date
  editForm.time = activity.time
  editForm.description = activity.description
  editForm.category = activity.category
  editForm.distance = activity.distance
  editForm.duration = activity.duration
  editForm.image = activity.image
}

function cancelEditing() {
  editingActivityId.value = null
}

async function saveActivity(activity: Activity) {
  const description = editForm.description.trim()
  const image = editForm.image.trim() || 'https://bulma.io/images/placeholders/1280x960.png'

  if (!editForm.date || !editForm.time || !description) {
    return
  }

  try {
    savingId.value = activity.id
    error.value = null
    await activityStore.updateActivity(activity.id, {
      userId: activity.userId,
      date: editForm.date,
      time: editForm.time,
      description,
      category: editForm.category,
      distance: Number(editForm.distance),
      duration: Number(editForm.duration),
      image,
    })
    cancelEditing()
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    savingId.value = null
  }
}

async function deleteActivity(activity: Activity) {
  const confirmed = window.confirm('Delete this activity?')
  if (!confirmed) return

  try {
    deletingId.value = activity.id
    error.value = null
    await activityStore.deleteActivity(activity.id)
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="admin-activities">
    <h2 class="title is-4">All Activities</h2>

    <div
      v-if="!sessionStore.user"
      class="not-logged-in"
    >
      Please log in to view activities.
    </div>

    <div v-else>
      <div
        v-if="isLoading"
        class="loading"
      >
        Loading activities...
      </div>

      <div
        v-else-if="error"
        class="error"
      >
        <span>Error: {{ error }}</span>

        <button @click="onRetry">
          Retry
        </button>
      </div>

      <div v-else>
        <div
          v-if="activityRows.length === 0"
          class="empty"
        >
          No activities found.
        </div>

        <table
          v-else
          class="table is-fullwidth is-striped admin-activities-table"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Activity</th>
              <th>Date</th>
              <th>Time</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="activity in activityRows"
              :key="activity.id"
            >
              <tr>
                <td>{{ activity.id }}</td>
                <td class="activity-type">{{ activity.category }}</td>
                <td>{{ activity.date }}</td>
                <td>{{ activity.time }}</td>
                <td>{{ activity.userName }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      type="button"
                      class="button is-small is-light"
                      :disabled="editingActivityId === activity.id"
                      @click="startEditing(activity)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="button is-small is-danger is-light"
                      :disabled="deletingId === activity.id"
                      @click="deleteActivity(activity)"
                    >
                      {{ deletingId === activity.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                v-if="editingActivityId === activity.id"
                class="activity-editor-row"
              >
                <td colspan="6">
                  <div class="activity-editor">
                    <div class="field-row">
                      <div class="field">
                        <label class="label">Date</label>
                        <div class="control">
                          <input v-model="editForm.date" class="input is-small" type="date" required />
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Time</label>
                        <div class="control">
                          <input v-model="editForm.time" class="input is-small" type="time" required />
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Category</label>
                        <div class="control">
                          <div class="select is-small is-fullwidth">
                            <select v-model="editForm.category">
                              <option v-for="category in categoryOptions" :key="category" :value="category">
                                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field-row">
                      <div class="field">
                        <label class="label">Duration (min)</label>
                        <div class="control">
                          <input v-model.number="editForm.duration" class="input is-small" type="number" min="1" required />
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Distance (mi)</label>
                        <div class="control">
                          <input v-model.number="editForm.distance" class="input is-small" type="number" min="0" step="0.1" required />
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Image URL</label>
                        <div class="control">
                          <input v-model="editForm.image" class="input is-small" type="url" />
                        </div>
                      </div>
                    </div>

                    <div class="field">
                      <label class="label">Description</label>
                      <div class="control">
                        <textarea v-model="editForm.description" class="textarea is-small" rows="2" required></textarea>
                      </div>
                    </div>

                    <div class="editor-actions">
                      <button
                        type="button"
                        class="button is-small is-success"
                        :disabled="savingId === activity.id"
                        @click="saveActivity(activity)"
                      >
                        {{ savingId === activity.id ? 'Saving...' : 'Save' }}
                      </button>
                      <button
                        type="button"
                        class="button is-small is-light"
                        :disabled="savingId === activity.id"
                        @click="cancelEditing"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-activities {
  max-width: 960px;
  margin: 0 auto;
}

.loading,
.error,
.empty,
.not-logged-in {
  padding: 0.5rem;
  color: #666;
}

.admin-activities-table {
  margin-top: 1rem;
}

.activity-type {
  text-transform: capitalize;
}

.action-buttons {
  display: inline-flex;
  gap: 0.5rem;
}

.activity-editor-row {
  background: var(--bulma-scheme-main-bis, #f7f7f7);
}

.activity-editor {
  display: grid;
  gap: 0.75rem;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .field-row {
    grid-template-columns: 1fr;
  }

  .editor-actions {
    justify-content: flex-start;
  }
}
</style>
