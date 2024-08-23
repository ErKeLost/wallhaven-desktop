<script setup lang="ts">
defineProps<{
  label: string
  path: string
  iconName: string
  iconNamespace?: string
  tooltip?: string
}>()

const route = useRoute()
</script>

<template>
  <router-link class="w-full block" :to="path">
    <var-tooltip
      class="w-full"
      placement="right"
      :content="tooltip"
      :disabled="!tooltip"
    >
      <var-button
        class="rounded-2! h-17! w-full"
        :focusable="false"
        :class="{ 'text-primary! bg-hsl-primary/20!': route.path === path }"
        text
      >
        <div class="flex flex-col space-y-2">
          <var-icon
            class="text-5xl!"
            :namespace="iconNamespace"
            :name="iconName"
          />
          <span class="text-md">{{ label }}</span>
        </div>
      </var-button>
    </var-tooltip>
  </router-link>
</template>
