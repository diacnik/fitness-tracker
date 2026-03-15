<script setup lang="ts">
import type { Activity, User } from '../types'

const props = defineProps<{
  activity: Activity
  user: User
}>()
</script>

<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img :src="props.user.profilePicture" :alt="props.user.username" class="is-rounded"/>
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ props.user.firstName }} {{ props.user.lastName }}</strong>
            <small> @{{ props.user.username }}</small>
            <small> · {{ props.activity.date }}</small>
          </p>
        </div>
      </div>
    </article>

    <figure class="image is-3by1 mb-3">
      <img :src="props.activity.image" :alt="props.activity.description" style="object-fit: cover;" />
    </figure>

    <div class="content mt-2">
      <p>{{ props.activity.description }}</p>
    </div>

    <nav class="level is-mobile mt-3">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Distance</p>
          <p class="title">{{ props.activity.distance > 0 ? `${props.activity.distance} mi` : '—' }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Duration</p>
          <p class="title">{{ props.activity.duration }} min</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Category</p>
          <p class="title">{{ props.activity.category.charAt(0).toUpperCase() + props.activity.category.slice(1) }}</p>
        </div>
      </div>
    </nav>

  </div>
</template>

<style scoped>

</style>
