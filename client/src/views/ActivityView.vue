<script setup lang="ts">
import { reactive, ref } from 'vue'
import ActivitiesList from '../components/ActivitiesList.vue'
import { useActivityStore } from '../stores/activity'
import type { ActivityCategory } from '../types'

const activityStore = useActivityStore()
const showCreateForm = ref(false)

const categoryOptions: ActivityCategory[] = ['run', 'climb', 'bike', 'other', 'hike']

const form = reactive({
  userId: activityStore.users[0]?.userId ?? 1,
  date: '',
  time: '',
  description: '',
  category: 'run' as ActivityCategory,
  distance: 0,
  duration: 30,
  image: '',
})

function closeForm() {
  showCreateForm.value = false
}

function submitActivity() {
  activityStore.addActivity({
    userId: Number(form.userId),
    date: form.date,
    time: form.time,
    description: form.description.trim(),
    category: form.category,
    distance: Number(form.distance),
    duration: Number(form.duration),
    image: form.image.trim() || 'https://bulma.io/images/placeholders/1280x960.png',
  })

  form.date = ''
  form.time = ''
  form.description = ''
  form.category = 'run'
  form.distance = 0
  form.duration = 30
  form.image = ''
  showCreateForm.value = false
}
</script>

<template>
  <section>
    <div class="container">
      <div class="activity-header">
        <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
          <h1 class="title is-2 mb-0">Recent Activities</h1>
          <button class="button is-link" @click="showCreateForm = true">Add Activity</button>
        </div>
      </div>
      <ActivitiesList filter-mode="current" />

      <div class="modal" :class="{ 'is-active': showCreateForm }">
        <div class="modal-background" @click="closeForm"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Create Activity</p>
            <button class="delete" aria-label="close" @click="closeForm"></button>
          </header>

          <form @submit.prevent="submitActivity">
            <section class="modal-card-body">
              <div class="field">
                <label class="label">User</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model.number="form.userId" required>
                      <option v-for="user in activityStore.users" :key="user.userId" :value="user.userId">
                        {{ user.firstName }} {{ user.lastName }} (@{{ user.username }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Date</label>
                    <div class="control">
                      <input v-model="form.date" class="input" type="date" required />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Time</label>
                    <div class="control">
                      <input v-model="form.time" class="input" type="time" required />
                    </div>
                  </div>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Category</label>
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="form.category" required>
                          <option v-for="category in categoryOptions" :key="category" :value="category">
                            {{ category.charAt(0).toUpperCase() + category.slice(1) }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Duration (min)</label>
                    <div class="control">
                      <input v-model.number="form.duration" class="input" type="number" min="1" required />
                    </div>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Distance (mi)</label>
                <div class="control">
                  <input v-model.number="form.distance" class="input" type="number" min="0" step="0.1" required />
                </div>
              </div>

              <div class="field">
                <label class="label">Image URL</label>
                <div class="control">
                  <input v-model="form.image" class="input" type="url" placeholder="https://example.com/activity.jpg" />
                </div>
              </div>

              <div class="field">
                <label class="label">Description</label>
                <div class="control">
                  <textarea v-model="form.description" class="textarea" rows="3" required></textarea>
                </div>
              </div>
            </section>

            <footer class="modal-card-foot">
              <button class="button is-link" type="submit">Save Activity</button>
              <button class="button" type="button" @click="closeForm">Cancel</button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activity-header {
  max-width: 720px;
  margin: 0 auto;
}
</style>

<style scoped>

</style>
