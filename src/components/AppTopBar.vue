<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <div class="w-full fixed top-0 z-2">
    <var-app-bar class="bg-body! text-text!" :elevation="0" border>
      <var-button text round @click="show = !show">
        <var-icon class="text-4xl!" name="menu" />
      </var-button>
    </var-app-bar>

    <var-popup position="left" v-model:show="show">
      <div>
        <app-sidebar />
      </div>
    </var-popup>
  </div>
</template>
