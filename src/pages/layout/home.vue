<script setup lang="ts">
const data = ref([
  { name: 'Mon', value: 820 },
  { name: 'Tue', value: 932 },
  { name: 'Wed', value: 901 },
  { name: 'Thu', value: 934 },
  { name: 'Fri', value: 1290 },
  { name: 'Sat', value: 1330 },
  { name: 'Sun', value: 1320 },
])
</script>

<template>
  <app-page>
    <app-page-header title="Home" description="This is the home page" />

    <app-page-content>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20px">
        <var-card
          title="Project"
          subtitle="Laborum ea ut ullamco laborum ut irure labore in ea id non pariatur commodo proident."
          v-for="i in 16"
          :key="i"
        >
          <app-line-chart :data="data" class="h-40" />
        </var-card>
      </div>
    </app-page-content>

    <template #bottom-bar>
      <div class="space-x-3">
        <var-button type="primary" round icon-container :elevation="0">
          <var-icon name="plus" />
        </var-button>
        <var-button type="info" round icon-container :elevation="0">
          <var-icon name="information" />
        </var-button>
        <var-button type="success" round icon-container :elevation="0">
          <var-icon name="check" />
        </var-button>
        <var-button type="warning" round icon-container :elevation="0">
          <var-icon name="warning" />
        </var-button>
        <var-button type="danger" round icon-container :elevation="0">
          <var-icon name="window-close" />
        </var-button>
      </div>
    </template>
  </app-page>
</template>
