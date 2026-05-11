<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'

const email = ref('')
const session = useSessionStore()
const router = useRouter()
const route = useRoute()

const handleLogin = async () => {
  try {
    await session.login(email.value, '')
    await router.replace(route.fullPath)
  } catch (error) {
    console.error('Failed to log in:', error)
  }
}
</script>

<template>
  <div class="login-inline">
    <form class="login-form" @submit.prevent="handleLogin">
      <div class="field">
        <div class="control has-icons-left">
          <input
            class="input is-small is-focused"
            type="email"
            v-model="email"
            placeholder="Email"
            required
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <button
          class="button is-dark is-small has-text-weight-bold"
          :class="{ 'is-loading': session.isLoading }"
          type="submit"
        >
          Log In
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-inline {
  display: flex;
  align-items: center;
}

.login-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-form .field {
  margin-bottom: 0;
}

.login-form .input {
  width: 13rem;
}

@media screen and (max-width: 1023px) {
  .login-form {
    flex-direction: column;
    align-items: stretch;
  }

  .login-form .input {
    width: 100%;
  }
}
</style>
