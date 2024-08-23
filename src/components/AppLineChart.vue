<script setup lang="ts">
import { useChart } from '@/composables'

const props = defineProps<{
  data: {
    name: string
    value: number
  }[]
}>()

const { elementRef } = useChart(
  computed(() => ({
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.name),
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        data: props.data.map((item) => item.value),
        type: 'line',
        smooth: true,
        color: 'hsl(256, 34%, 48%)',
        symbolSize: 10,
        lineStyle: {
          width: 6,
          color: 'hsl(256, 34%, 48%)',
        },
      },
    ],
  }))
)
</script>

<template>
  <div ref="elementRef"></div>
</template>
