<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
      <p class="text-gray-600">Completing login...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { exchangeTokenWithUmbrella } from '../../auth/umbrellaAuth';

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    router.push('/login');
    return;
  }

  try {
    await exchangeTokenWithUmbrella(token);
    router.push('/dashboard');
  } catch (e) {
    router.push('/login?error=auth_failed');
  }
});
</script>
