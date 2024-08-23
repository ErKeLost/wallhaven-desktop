<template>
  <div
    class="min-h-screen pt-[calc(var(--app-bar-height)+1px)] sm:pt-0"
    :class="{ 'pb-[var(--app-bar-height)]': $slots['bottom-bar'] }"
  >
    <slot />

    <app-page-bottom-bar v-if="$slots['bottom-bar']">
      <slot name="bottom-bar" />
    </app-page-bottom-bar>
  </div>
</template>
