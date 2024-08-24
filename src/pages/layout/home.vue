<script setup lang="ts">
import { createAxle } from "@varlet/axle";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
// const axle = createAxle({ baseURL: "/api" });
// const axle = createAxle();

// const res = await axle.get("/wallhaven/w/3lv8j6");
const imageData = ref([]);
const topQuery = reactive({
  page: 1,
  toprange: "3d"
});
async function query() {
  topQuery.page = topQuery.page + 1;
  const res = await fetch(
    `https://heaven-walls-api.vercel.app/api/wallhaven/topwalls?page=${topQuery.page}&toprange=${topQuery.toprange}`
  );
  const data = await res.json();
  console.log(data);
  imageData.value = data.data
}
query();
async function changePaper(item) {
  await invoke("download_and_set_wallpaper", {
    url: item.path,
    fileName: "wallhaven-" + item.id
  });
}
async function queryPaper() {
  query();
}
</script>

<template>
  <app-page>
    <app-page-header title="Home" description="This is the home page" />

    <app-page-content>
      <var-button @click="queryPaper">换下一页</var-button>
      <var-button @click="changePaper">修改壁纸</var-button>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20px">
        <var-card
          v-for="i in imageData"
          :key="i"
          @click="changePaper(i)"
        >
          <var-image
            lazy
            :loading="i.path"
            :error="i.path"
            :src="i.path"
          />
        </var-card>
      </div>
    </app-page-content>
  </app-page>
</template>
