<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-10">Loading profile...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>
    <div v-else-if="profile" class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center gap-6 mb-6">
        <div class="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 text-3xl font-bold">
          {{ profile.displayName?.charAt(0) || profile.email?.charAt(0) || 'U' }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ profile.displayName || 'Anonymous User' }}</h1>
          <p class="text-gray-500">{{ profile.title || 'Member' }}</p>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <h2 class="text-lg font-semibold mb-4">Public Pages</h2>
        <div v-if="profile.publicPages && profile.publicPages.length" class="grid gap-4 sm:grid-cols-2">
           <div v-for="page in profile.publicPages" :key="page.slug" class="border p-4 rounded-md hover:shadow-sm transition">
              <router-link :to="`/p/${page.slug}`" class="text-indigo-600 font-medium hover:underline">{{ page.title }}</router-link>
              <p class="text-sm text-gray-500 mt-1">{{ page.description }}</p>
           </div>
        </div>
        <p v-else class="text-gray-500 italic">No public pages available.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const profileId = route.params.id as string;

const loading = ref(true);
const error = ref('');
const profile = ref<any>(null);

onMounted(async () => {
  try {
    const res = await fetch(`/api/users/${profileId}/public`);
    if (!res.ok) throw new Error('Profile not found or access denied');
    profile.value = await res.json();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>
