<template>
  <div ref="reactRoot"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import { InsightsPage } from '../modules/insights/InsightsPage';

const reactRoot = ref<HTMLElement | null>(null);
let root: Root | null = null;

onMounted(() => {
  if (reactRoot.value) {
    root = createRoot(reactRoot.value);
    root.render(React.createElement(InsightsPage));
  }
});

onBeforeUnmount(() => {
  if (root) {
    root.unmount();
  }
});
</script>
