<template>
  <div ref="reactRoot"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, watch } from 'vue';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';

const props = defineProps<{
  component: React.ElementType;
}>();

const reactRoot = ref<HTMLElement | null>(null);
let root: Root | null = null;

onMounted(() => {
  if (reactRoot.value) {
    root = createRoot(reactRoot.value);
    root.render(React.createElement(props.component));
  }
});

watch(() => props.component, (newComponent) => {
   if (root) {
      root.render(React.createElement(newComponent));
   }
});

onBeforeUnmount(() => {
  if (root) {
    root.unmount();
  }
});
</script>
