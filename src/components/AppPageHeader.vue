<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="w-full sticky top-[var(--app-bar-height)] sm:top-0 z-1">
    <var-style-provider :style-vars="{ '--app-bar-height': '0' }">
      <var-app-bar class="bg-body! text-text!" :elevation="0" border>
        <template #content>
          <div class="px-5 py-4">
            <div class="text-3xl">{{ title }}</div>
            <div
              class="text-md text-on-surface-variant mt-2"
              v-if="description"
            >
              {{ description }}
            </div>
          </div>
        </template>
      </var-app-bar>
    </var-style-provider>
  </div>
</template>
