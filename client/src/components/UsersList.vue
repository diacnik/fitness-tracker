<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useSessionStore } from '../stores/session'
import type { User, DataEnvelope, DataListEnvelope, UserRole } from '../../../server/types'

const sessionStore = useSessionStore()
const users = ref<User[]>([])
const editingUserId = ref<number | null>(null)
const editForm = reactive({
  firstName: '',
  lastName: '',
  username: '',
  profilePicture: '',
  role: 'user' as UserRole,
})

onMounted(async () => {
  try {
    const response = await sessionStore.api<DataListEnvelope<User>>('users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to load users:', error)
  }
})

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    if (a.role !== b.role) {
      return a.role === 'admin' ? -1 : 1
    }

    return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
  })
})

const startEditing = (user: User) => {
  editingUserId.value = user.id
  editForm.firstName = user.firstName
  editForm.lastName = user.lastName
  editForm.username = user.username
  editForm.profilePicture = user.profilePicture
  editForm.role = user.role
}

const cancelEditing = () => {
  editingUserId.value = null
}

const deleteUser = async (user: User) => {
  const confirmed = window.confirm(
    `Delete ${user.firstName} ${user.lastName} and all of their activities?`,
  )

  if (!confirmed) {
    return
  }

  if (editingUserId.value === user.id) {
    cancelEditing()
  }

  try {
    await sessionStore.api(`users/${user.id}`, null, { method: 'DELETE' })
    users.value = users.value.filter(u => u.id !== user.id)
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

const saveUser = async (userId: number) => {
  const firstName = editForm.firstName.trim()
  const lastName = editForm.lastName.trim()
  const username = editForm.username.trim()
  const profilePicture = editForm.profilePicture.trim()

  if (!firstName || !lastName || !username || !profilePicture) {
    return
  }

  try {
    const response = await sessionStore.api<DataEnvelope<User>>(`users/${userId}`, {
      firstName,
      lastName,
      username,
      profilePicture,
      role: editForm.role,
    }, { method: 'PATCH' })

    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value[index] = response.data
    }
    cancelEditing()
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}
</script>

<template>
  <section class="users-list">
    <h2 class="title is-4">Users</h2>

    <ul class="users-grid">
      <li
        v-for="user in sortedUsers"
        :key="user.id"
        :class="['user-card', { 'user-card-editing': editingUserId === user.id }]"
      >
        <img
          :src="editingUserId === user.id ? editForm.profilePicture : user.profilePicture"
          :alt="`${user.firstName} ${user.lastName}`"
          class="user-avatar"
        />

        <template v-if="editingUserId === user.id">
          <div class="user-editor">
            <div class="field-row">
              <div class="field">
                <label class="label" :for="`first-name-${user.id}`">First name</label>
                <div class="control">
                  <input
                    :id="`first-name-${user.id}`"
                    v-model="editForm.firstName"
                    class="input is-small"
                    type="text"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label" :for="`last-name-${user.id}`">Last name</label>
                <div class="control">
                  <input
                    :id="`last-name-${user.id}`"
                    v-model="editForm.lastName"
                    class="input is-small"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="label" :for="`username-${user.id}`">Username</label>
                <div class="control">
                  <input
                    :id="`username-${user.id}`"
                    v-model="editForm.username"
                    class="input is-small"
                    type="text"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label" :for="`avatar-${user.id}`">Profile picture</label>
                <div class="control">
                  <input
                    :id="`avatar-${user.id}`"
                    v-model="editForm.profilePicture"
                    class="input is-small"
                    type="url"
                  />
                </div>
              </div>
            </div>

            <label class="checkbox is-size-7">
              <input v-model="editForm.role" type="checkbox" true-value="admin" false-value="user" />
              Admin user
            </label>
          </div>
        </template>

        <div v-else class="user-meta">
          <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="user-username">@{{ user.username }}</p>
        </div>

        <span v-if="user.role === 'admin'" class="tag is-warning is-light">Admin</span>

        <div class="user-actions">
          <template v-if="editingUserId === user.id">
            <button type="button" class="button is-small is-success" @click="saveUser(user.id)">
              Save
            </button>
            <button type="button" class="button is-small is-light" @click="cancelEditing">
              Cancel
            </button>
          </template>
          <button v-else type="button" class="button is-small" @click="startEditing(user)">Edit</button>
          <button type="button" class="button is-small is-danger is-light" @click="deleteUser(user)">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.users-list {
  max-width: 720px;
  margin: 0 auto;
}

.users-grid {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.75rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--bulma-border, #dbdbdb);
  border-radius: 0.75rem;
  background: var(--bulma-scheme-main, #fff);
}

.user-card-editing {
  align-items: flex-start;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.user-meta {
  flex: 1;
}

.user-editor {
  flex: 1;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.field-row + .field-row,
.field-row + .checkbox {
  margin-top: 0.75rem;
}

.label {
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
}

.user-name {
  margin: 0;
  font-weight: 600;
}

.user-username {
  margin: 0.1rem 0 0;
  color: var(--bulma-text-weak, #6b7280);
  font-size: 0.95rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  align-self: center;
}

@media (max-width: 768px) {
  .user-card {
    flex-wrap: wrap;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .user-actions {
    width: 100%;
  }
}

</style>
