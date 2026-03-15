import data from '../data/users.json';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '../types';

type UserUpdates = Partial<Omit<User, 'userId'>>;

export const useUserStore = defineStore('user', () => {
  const CURRENT_USER_STORAGE_KEY = 'currentUserId'; // Key for localStorage to persist current user ID

  const users = ref<User[]>(data.map(user => ({
    ...user,
    profilePicture: user.profilePicture || 'https://via.placeholder.com/150', // Default profile picture if missing
  })));

  const getInitialCurrentUserId = () => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedId = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!storedId) {
      return null;
    }

    const parsedId = Number(storedId);
    return Number.isNaN(parsedId) ? null : parsedId;
  };

  const currentUserId = ref<number | null>(getInitialCurrentUserId());

  const currentUser = computed<User | null>(() => {
    if (currentUserId.value === null) {
      return null;
    }

    return users.value.find(user => user.userId === currentUserId.value) ?? null;
  });

  const setCurrentUser = (userId: number) => {
    const userExists = users.value.some(user => user.userId === userId);
    if (!userExists) {
      return false;
    }

    currentUserId.value = userId;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, String(userId));
    }

    return true;
  };

  const clearCurrentUser = () => {
    currentUserId.value = null;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  };

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

    if (currentUserId.value === userId) {
      clearCurrentUser();
    }

    return users.value.length !== originalLength; // Return true if a user was deleted, false otherwise
  };

  const userMap = computed(() => {
    const map: Record<number, User> = {};
    users.value.forEach(user => {
      map[user.userId] = user;
    });
    return map;
  });

  return {
    users,
    userMap,
    currentUserId,
    currentUser,
    setCurrentUser,
    clearCurrentUser,
    updateUser,
    deleteUser,
  };
});
