import useSessionStore from '../stores/session'
import type { DataListEnvelope, Activity } from '../../../server/types'

export function getActivities() {
  const session = useSessionStore()
  return session.api<DataListEnvelope<Activity>>('activities')
}

export function getActivity(id: number) {
  const session = useSessionStore()
  return session.api<Activity>(`activities/${id}`)
}
