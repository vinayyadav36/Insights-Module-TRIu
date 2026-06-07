<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
    </div>

    <div v-if="loading" class="text-center py-10">Loading admin data...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.email }}</div>
              <div class="text-sm text-gray-500">{{ user.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ new Date(user.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="toggleRole(user)" class="text-indigo-600 hover:text-indigo-900">
                Make {{ user.role === 'admin' ? 'User' : 'Admin' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const users = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

const loadUsers = async () => {
  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (!res.ok) throw new Error('Failed to load users or unauthorized');
    users.value = await res.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

onMounted(loadUsers);

const toggleRole = async (user: any) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin';
  try {
    const res = await fetch(`/api/admin/users/${user.id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      user.role = newRole;
    }
  } catch (e) {
    alert('Failed to update role');
  }
};
</script>
