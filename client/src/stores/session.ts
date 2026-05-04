/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import type { User, DataEnvelope } from '../../../server/types'
import { computed, ref } from 'vue'

import { loadScript, api as myApi } from '../services/myFetch'

export type FeedbackMessage = {
  type: 'success' | 'danger' | 'info'
  text: string
}

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const googleToken = ref<string | null>(null);

  async function login() {
    // void on left hand side
    await loadScript('https://accounts.google.com/gsi/client', 'google-signin');

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        console.log ({ response });
        googleToken.value = response.access_token;
        await exchangeForOurToken(response.access_token);
      },
    });
    tokenClient.requrestAccessToken();

    function exchangeForOurToken(googleToken: string) {
      const response = await myApi<DataEnvelope<{ token: string; user: User }>>(
        'users/login',
        { googleToken },
        { method: 'POST' },
      );

      if (!response.isSuccess) {
        addMessage(response.message || 'Login failed', 'danger');
        return;
      }

      const { user: loggedInUser, token: authToken } = response.data;
      token.value = authToken;
      user.value = loggedInUser;
    }

  function logout() {
    user.value = null
    token.value = null
  }

  const messages = ref<FeedbackMessage[]>([])
  function addMessage(text: string, type: FeedbackMessage['type'] = 'info') {
    messages.value.push({ type, text })
  }
  function handleError(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message
    addMessage(message, 'danger')
    console.error(error)
  }

  const loadingCount = ref(0)
  const isLoading = computed(() => loadingCount.value > 0)

  function api<T>(endpoint: string, data?: unknown, options: RequestInit = {}) {
    loadingCount.value++

    options.headers = {
      'Content-Type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers,
    }

    return myApi<T>(endpoint, data, options)
      .catch((error) => {
        handleError(error)
        throw error
      })
      .finally(() => {
        loadingCount.value--
      });
  }

  return {
    user,
    messages,
    addMessage,
    handleError,
    isLoading,
    api,
    token,
    logout,
    login,
    googleToken
  }
}
})

export default useSessionStore
