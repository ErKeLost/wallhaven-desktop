<script setup lang="ts">
import { createAxle } from "@varlet/axle";

// const axle = createAxle({ baseURL: "/api" });
const axle = createAxle();

// const res = await axle.get("/wallhaven/w/3lv8j6");
fetch("/base").then((res) => res.json()).then(console.log);
// console.log(res);
</script>

<template>
  <app-page>
    <app-page-header title="Home" description="This is the home page" />

    <app-page-content> </app-page-content>
  </app-page>
</template>
