<template>
  <div class="flex items-start">
    <div class="sticky top-0 hidden sm:block">
      <app-sidebar />
    </div>

    <div class="w-full">
      <div class="block sm:hidden">
        <app-top-bar />
      </div>

      <router-view />
    </div>
  </div>
</template>
