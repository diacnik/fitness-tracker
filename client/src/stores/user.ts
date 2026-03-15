import data from '../data/users.json';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '../types';

type UserUpdates = Partial<Omit<User, 'userId'>>;

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>(data.map(user => ({
    ...user,
    profilePicture: user.profilePicture || 'https://via.placeholder.com/150', // Default profile picture if missing
  })));

  const updateUser = (userId: number, updates: UserUpdates) => {
    const userIndex = users.value.findIndex(user => user.userId === userId);

    if (userIndex === -1) {
      return false;
    }

    const currentUser = users.value[userIndex];

    if (!currentUser) {
      return false;
    }

    users.value[userIndex] = {
      ...currentUser,
      ...updates,
    };

    return true;
  };

  // Delete a user by their userId by filtering out the user from the users array
  const deleteUser = (userId: number) => {
    const originalLength = users.value.length; // Store the original length before deletion
    users.value = users.value.filter(user => user.userId !== userId); // Filter out the user to be deleted

    return users.value.length !== originalLength; // Return true if a user was deleted, false otherwise
  };

  const userMap = computed(() => {
    const map: Record<number, User> = {};
    users.value.forEach(user => {
      map[user.userId] = user;
    });
    return map;
  });

  return { users, userMap, updateUser, deleteUser };
});
