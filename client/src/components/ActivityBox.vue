<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useActivityStore } from '../stores/activity'
import type { Activity, ActivityCategory, User } from '../types'

const props = defineProps<{
  activity: Activity
  user: User
}>()

const activityStore = useActivityStore()
const isEditing = ref(false)
const categoryOptions: ActivityCategory[] = ['run', 'climb', 'bike', 'other', 'hike']
const editForm = reactive({
  userId: props.activity.userId,
  date: props.activity.date,
  time: props.activity.time,
  description: props.activity.description,
  category: props.activity.category,
  distance: props.activity.distance,
  duration: props.activity.duration,
  image: props.activity.image,
})

const startEditing = () => {
  editForm.userId = props.activity.userId
  editForm.date = props.activity.date
  editForm.time = props.activity.time
  editForm.description = props.activity.description
  editForm.category = props.activity.category
  editForm.distance = props.activity.distance
  editForm.duration = props.activity.duration
  editForm.image = props.activity.image
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveActivity = () => {
  const description = editForm.description.trim()
  const image = editForm.image.trim() || 'https://bulma.io/images/placeholders/1280x960.png'

  if (!editForm.date || !editForm.time || !description) {
    return
  }

  activityStore.updateActivity(props.activity.id, {
    userId: Number(editForm.userId),
    date: editForm.date,
    time: editForm.time,
    description,
    category: editForm.category,
    distance: Number(editForm.distance),
    duration: Number(editForm.duration),
    image,
  })

  isEditing.value = false
}

const deleteActivity = () => {
  const confirmed = window.confirm('Delete this activity?')

  if (!confirmed) {
    return
  }

  activityStore.deleteActivity(props.activity.id)
}
</script>

<template>
  <div class="box activity-box">
    <template v-if="isEditing">
      <div class="field">
        <label class="label">User</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model.number="editForm.userId">
              <option v-for="userOption in activityStore.users" :key="userOption.userId" :value="userOption.userId">
                {{ userOption.firstName }} {{ userOption.lastName }} (@{{ userOption.username }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input v-model="editForm.date" class="input" type="date" required />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Time</label>
            <div class="control">
              <input v-model="editForm.time" class="input" type="time" required />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Category</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="editForm.category">
                  <option v-for="category in categoryOptions" :key="category" :value="category">
                    {{ category.charAt(0).toUpperCase() + category.slice(1) }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Duration (min)</label>
            <div class="control">
              <input v-model.number="editForm.duration" class="input" type="number" min="1" required />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Distance (mi)</label>
            <div class="control">
              <input v-model.number="editForm.distance" class="input" type="number" min="0" step="0.1" required />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Image URL</label>
            <div class="control">
              <input v-model="editForm.image" class="input" type="url" />
            </div>
          </div>
        </div>

        <div class="column is-full">
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea v-model="editForm.description" class="textarea" rows="3" required></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-actions">
        <button type="button" class="button is-success is-small" @click="saveActivity">Save</button>
        <button type="button" class="button is-light is-small" @click="cancelEditing">Cancel</button>
      </div>
    </template>

    <template v-else>
      <article class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="props.user.profilePicture" :alt="props.user.username" class="is-rounded" />
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{ props.user.firstName }} {{ props.user.lastName }}</strong>
              <small> @{{ props.user.username }}</small>
              <small> · {{ props.activity.date }}</small>
            </p>
          </div>
        </div>
        <div class="media-right">
          <button type="button" class="button is-small" @click="startEditing">Edit</button>
          <button type="button" class="button is-small is-danger is-light" @click="deleteActivity">Delete</button>
        </div>
      </article>

      <div class="columns is-mobile is-vcentered mb-3">
        <div class="column is-two-thirds">
          <div class="content mt-2">
            <p>{{ props.activity.description }}</p>
          </div>
        </div>
        <div class="column is-one-third">
          <figure class="image is-3by1">
            <img :src="props.activity.image" :alt="props.activity.description" class="activity-image" />
          </figure>
        </div>
      </div>

      <nav class="level is-mobile mt-3">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Distance</p>
            <p class="title">{{ props.activity.distance > 0 ? `${props.activity.distance} mi` : '—' }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Duration</p>
            <p class="title">{{ props.activity.duration }} min</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="title">{{ props.activity.category.charAt(0).toUpperCase() + props.activity.category.slice(1) }}</p>
          </div>
        </div>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.activity-box {
  overflow: hidden;
}

.activity-image {
  object-fit: cover;
}

.activity-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .activity-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .level {
    align-items: flex-start;
  }
}
</style>
