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
  <div class="landing-container">
    <div class="hero">
      <h1>Welcome to Fitness Tracker</h1>
      <p>Log in to track your activities and reach your goals!</p>
    </div>

    <div class="auth-sections">
      <!-- Login Section -->
      <section class="auth-box">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="field">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="Enter your email" required />
          </div>
          <button class="button is-primary" type="submit">Log In</button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.hero {
  margin-bottom: 3rem;
}

.auth-sections {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.auth-box {
  flex: 1;
  min-width: 300px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.field {
  margin-bottom: 1rem;
  text-align: left;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
