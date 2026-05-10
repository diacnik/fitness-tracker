<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useConnectionStore } from '@/stores/connections'
import type { Connection, ConnectionStatus, DataListEnvelope, User } from '../../../server/types'

type ConnectionRow = Connection & {
  userLowName: string
  userHighName: string
  requestedByName: string
}

const sessionStore = useSessionStore()
const connectionStore = useConnectionStore()

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const updatingId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

async function loadUsers() {
  const response = await sessionStore.api<DataListEnvelope<User>>('users')
  users.value = response.data
}

async function loadConnections() {
  await connectionStore.loadConnections()
}

async function load() {
  if (!sessionStore.user) return

  try {
    isLoading.value = true
    error.value = null
    await Promise.all([loadConnections(), loadUsers()])
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    isLoading.value = false
  }
}

const usersById = computed(() => {
  return new Map(users.value.map((user) => [user.id, user]))
})

const connectionRows = computed<ConnectionRow[]>(() => {
  const lookup = usersById.value

  return connectionStore.connections.map((connection) => {
    const userLow = lookup.get(connection.userLowId)
    const userHigh = lookup.get(connection.userHighId)
    const requestedBy = lookup.get(connection.requestedBy)

    return {
      ...connection,
      userLowName: userLow ? `${userLow.firstName} ${userLow.lastName}` : `User #${connection.userLowId}`,
      userHighName: userHigh ? `${userHigh.firstName} ${userHigh.lastName}` : `User #${connection.userHighId}`,
      requestedByName: requestedBy
        ? `${requestedBy.firstName} ${requestedBy.lastName}`
        : `User #${connection.requestedBy}`,
    }
  })
})

function onRetry() {
  void load()
}

const statusOrder: ConnectionStatus[] = ['pending', 'accepted', 'blocked']

function nextStatus(current: ConnectionStatus) {
  const index = statusOrder.indexOf(current)
  return statusOrder[(index + 1) % statusOrder.length]
}

async function updateStatus(connection: Connection) {
  try {
    updatingId.value = connection.id
    error.value = null
    const status = nextStatus(connection.status)
    await connectionStore.updateConnection(connection.id, { status })
  } catch (err: any) {
    error.value = err?.message ?? String(err)
  } finally {
    updatingId.value = null
  }
}

async function deleteConnection(connection: Connection) {
  const confirmed = window.confirm('Delete this connection?')
  if (!confirmed) return

  try {
    deletingId.value = connection.id
    error.value = null
    await connectionStore.deleteConnection(connection.id)
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
  <section class="admin-connections">
    <h2 class="title is-4">All Connections</h2>

    <div
      v-if="!sessionStore.user"
      class="not-logged-in"
    >
      Please log in to view connections.
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
          v-if="connectionRows.length === 0"
          class="empty"
        >
          No connections found.
        </div>

        <table
          v-else
          class="table is-fullwidth is-striped admin-connections-table"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Users</th>
              <th>Status</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="connection in connectionRows"
              :key="connection.id"
            >
              <td>{{ connection.id }}</td>
              <td>
                {{ connection.userLowName }}
                <span class="connection-divider">&lt;-&gt;</span>
                {{ connection.userHighName }}
              </td>
              <td>
                <button
                  type="button"
                  class="button is-small is-light status-button"
                  :class="`is-${connection.status === 'accepted' ? 'success' : connection.status === 'blocked' ? 'danger' : 'warning'}`"
                  :disabled="updatingId === connection.id"
                  @click="updateStatus(connection)"
                >
                  {{ updatingId === connection.id ? 'Updating...' : connection.status }}
                </button>
              </td>
              <td>{{ connection.requestedByName }}</td>
              <td>
                <button
                  type="button"
                  class="button is-small is-danger is-light"
                  :disabled="deletingId === connection.id"
                  @click="deleteConnection(connection)"
                >
                  {{ deletingId === connection.id ? 'Deleting...' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-connections {
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

.admin-connections-table {
  margin-top: 1rem;
}

.connection-divider {
  padding: 0 0.35rem;
  color: var(--bulma-text-weak, #6b7280);
}

.status-button {
  text-transform: capitalize;
}
</style>
