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
// console.log(res);
async function changePaper() {
  console.log("修改壁纸");
  await invoke("download_and_set_wallpaper", {
    url: "https://w.wallhaven.cc/full/o5/wallhaven-o5q7mp.jpg",
    fileName: "pic",
  });
}
</script>

<template>
  <app-page>
    <app-page-header title="Home" description="This is the home page" />

    <app-page-content>
      <var-button @click="changePaper">修改壁纸</var-button>
      <img src="../../assets/images/girl.jpg" style="width: 100%" alt="" />
    </app-page-content>
  </app-page>
</template>
