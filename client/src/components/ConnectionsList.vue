<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useConnectionStore } from '@/stores/connections'
import type { ConnectedUser, User } from '../../../server/types'

const props = defineProps<{
  limit?: number
  compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-user', userId: number): void
}>()

const sessionStore = useSessionStore()
const connectionStore = useConnectionStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const disconnectingId = ref<number | null>(null)

async function load() {
  const currentUser = sessionStore.user

  if (!currentUser) return

  try {
    isLoading.value = true
    error.value = null

    await connectionStore.loadUserConnections(currentUser.id)
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    isLoading.value = false
  }
}

const connectedUsers = computed(() => {
  const users = connectionStore.userConnections ?? []

  return props.limit
    ? users.slice(0, props.limit)
    : users
})

function onRetry() {
  void load()
}

function selectUser(user: User) {
  emit('select-user', user.id)
}

async function disconnectUser(user: ConnectedUser) {
  if (!sessionStore.user) return

  try {
    disconnectingId.value = user.connectionId
    error.value = null
    await connectionStore.deleteConnection(user.connectionId)
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    disconnectingId.value = null
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="connections-list">
    <div
      v-if="!sessionStore.user"
      class="not-logged-in"
    >
      Please log in to view your connections.
    </div>

    <div v-else>
      <div
        v-if="isLoading"
        class="loading"
      >
        Loading connections…
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
          v-if="connectedUsers.length === 0"
          class="empty"
        >
          No connections yet.
        </div>

        <ul
          v-else
          class="users-grid"
        >
          <li
            v-for="user in connectedUsers"
            :key="user.id"
            class="user-card"
          >
            <img
              v-if="user.profilePicture"
              :src="user.profilePicture"
              :alt="`${user.firstName} ${user.lastName}`"
              class="user-avatar"
              @click="selectUser(user)"
            />

            <div
              class="user-meta"
              @click="selectUser(user)"
            >
              <p class="user-name">
                {{ user.firstName }} {{ user.lastName }}
              </p>

              <p class="user-username">
                @{{ user.username }}
              </p>
            </div>

            <div class="user-actions">
              <button
                type="button"
                class="button is-small"
                :disabled="disconnectingId === user.connectionId"
                @click="disconnectUser(user)"
              >
                {{ disconnectingId === user.connectionId ? 'Disconnecting…' : 'Disconnect' }}
              </button>

              <button
                type="button"
                class="button is-small is-danger is-light"
              >
                Block
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connections-list {
  font-family: inherit;
}

.loading,
.error,
.empty,
.not-logged-in {
  padding: 0.5rem;
  color: #666;
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

.user-avatar {
  width: 52px;
  height: 52px;

  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;

  cursor: pointer;
}

.user-meta {
  flex: 1;
  cursor: pointer;
}

.user-name {
  margin: 0;
  font-weight: 600;
}

.user-username {
  margin-top: 0.1rem;

  color: var(--bulma-text-weak, #6b7280);
  font-size: 0.95rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  align-self: center;
}
</style>
