import data from '../data/users.json';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '../types';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(data.map(user => ({
    ...user,
    profilePicture: user.profilePicture || 'https://via.placeholder.com/150', // Default profile picture if missing
  })));

  const userMap = computed(() => {
    const map: Record<number, User> = {};
    users.value.forEach(user => {
      map[user.userId] = user;
    });
    return map;
  });

  return { users, userMap };
});
