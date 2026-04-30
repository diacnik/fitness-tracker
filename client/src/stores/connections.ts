import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataEnvelope, DataListEnvelope, Connection } from '../../../server/types'
import useSessionStore from './session'

export const useConnectionStore = defineStore('connection', () => {
  const session = useSessionStore()
  const connections = ref<Connection[]>([])

  async function loadConnections() {
    const data = await session.api<DataListEnvelope<Connection>>('connections')
    connections.value = data.data
  }

  // Load connections for a specific user (either as sender or recipient)
  async function loadForUser(userId: number) {
    const data = await session.api<DataListEnvelope<Connection>>(`connections/user/${userId}`)
    connections.value = data.data
  }

  async function getConnection(id: number) {
    return session.api<DataEnvelope<Connection>>(`connections/${id}`)
  }

  async function createConnection(connection: Omit<Connection, 'id'>) {
    const data = await session.api<DataEnvelope<Connection>>('connections', connection)
    connections.value.push(data.data)
    return data
  }

  async function updateConnection(id: number, connection: Partial<Connection>) {
    const data = await session.api<DataEnvelope<Connection>>(`connections/${id}`, connection, { method: 'PATCH' })
    const index = connections.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      connections.value[index] = data.data
    }
    return data
  }

  async function deleteConnection(id: number) {
    const data = await session.api<DataEnvelope<null>>(`connections/${id}`, null, { method: 'DELETE' })
    const index = connections.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      connections.value.splice(index, 1)
    }
    return data
  }

  return {
    connections,
    loadConnections,
    loadForUser,
    getConnection,
    createConnection,
    updateConnection,
    deleteConnection,
  }
})
