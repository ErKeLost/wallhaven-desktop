<script setup lang="ts">
import { useDark } from "@/composables";
import { config } from "@/config";
import { useRouter } from "vue-router";

const { toggleDark } = useDark();
const router = useRouter();

function handleAccountChange(value: string) {
  switch (value) {
    case "switch-theme":
      toggleDark();
      break;
    case "sign-out":
      router.push("/sign-in");
      break;
  }
}
</script>

<template>
  <div
    class="flex-col flex-shrink-0! py-2 items-center justify-between px-2 flex overflow-hidden w-22 h-screen bg-surface-container"
  >
    <div class="w-full space-y-2">
      <app-logo />

      <div
        class="flex flex-col items-center space-y-2 overflow-auto pb-2 max-h-[calc(100vh-158px)]"
      >
        <app-sidebar-item
          v-for="item in config.sidebar.items"
          :key="item.path"
          v-bind="item"
        />
      </div>
    </div>

    <div class="w-full">
      <app-sidebar-account @change="handleAccountChange" />
    </div>
  </div>
</template>
