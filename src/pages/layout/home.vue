<script setup lang="ts">
import { createAxle } from "@varlet/axle";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
// const axle = createAxle({ baseURL: "/api" });
// const axle = createAxle();

// const res = await axle.get("/wallhaven/w/3lv8j6");
fetch("/base")
  .then((res) => res.json())
  .then(console.log);
async function changePaper() {
  await invoke("download_and_set_wallpaper", {
    url: "https://w.wallhaven.cc/full/yx/wallhaven-yx6e9l.jpg",
    fileName: "pic",
  });
}
</script>

<template>
  <app-page>
    <app-page-header title="Home" description="This is the home page" />

    <app-page-content>
      <var-button @click="changePaper">修改壁纸</var-button>
      <img src="../../assets/images/test.jpg" style="width: 100%" alt="" />
    </app-page-content>
  </app-page>
</template>
