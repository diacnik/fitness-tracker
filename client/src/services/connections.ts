import useSessionStore from '../stores/session'
import type { DataListEnvelope, DataEnvelope, Connection } from '../../../server/types'

export function getConnections() {
  const session = useSessionStore()
  return session.api<DataListEnvelope<Connection>>('connections')
}

export function getConnectionsForUser(userId: number) {
  const session = useSessionStore()
  return session.api<DataListEnvelope<Connection>>(`connections/user/${userId}`)
}

export function getConnection(id: number) {
  const session = useSessionStore()
  return session.api<DataEnvelope<Connection>>(`connections/${id}`)
}
