<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'

const email = ref('')
const session = useSessionStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    await session.login(email.value, "")
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Failed to log in:', error)
  }
}
</script>

<template>
  <div class="landing-page">
    <section class="hero is-primary is-medium is-bold">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-1 is-size-2-mobile">
            <span class="icon is-large mr-2"><i class="fas fa-running"></i></span>
            Fitness Tracker
          </h1>
          <p class="subtitle is-3 is-size-5-mobile mt-3">
            Track your activities, connect with friends, and hit your fitness goals today.
          </p>
        </div>
      </div>
    </section>

    <div class="container px-4 mt-6 pb-6">
      <div class="columns is-centered is-vcentered login-wrapper">
        <div class="column is-6-tablet is-5-desktop is-4-widescreen">
          <div class="box login-box has-background-white">
            <h2 class="title is-4 has-text-centered has-text-dark mb-5">Welcome Back</h2>
            <form @submit.prevent="handleLogin">
              <div class="field">
                <label class="label has-text-grey-dark">Email Account</label>
                <div class="control has-icons-left">
                  <input
                    class="input is-medium is-focused"
                    type="email"
                    v-model="email"
                    placeholder="e.g. alex@example.com"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
              </div>

              <div class="field mt-5">
                <button class="button is-primary is-medium is-fullwidth has-text-weight-bold" :class="{'is-loading': session.isLoading}" type="submit">
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  margin-top: -3rem;
}

.login-wrapper {
  margin-top: -5rem;
}

.login-box {
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.login-box:hover {
  transform: translateY(-2px);
}
</style>
