import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

import { useWindowSize } from '@vueuse/core'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

export function useChart(initialOption: ComputedRef<ECOption>): {
  chart: echarts.ECharts | undefined
  elementRef: Ref<HTMLElement | undefined>
} {
  const elementRef = ref<HTMLElement>()

  let chart: echarts.ECharts | undefined = undefined

  const { width, height } = useWindowSize()

  watch(
    () => [width.value, height.value],
    () => {
      chart?.resize()
    }
  )

  watch(() => initialOption.value, () => {
    chart?.setOption(initialOption.value)
  })

  onMounted(() => {
    chart = echarts.init(elementRef.value)
    chart.setOption(initialOption.value)
  })

  onBeforeMount(() => {
    chart?.dispose()
  })

  return {
    chart,
    elementRef,
  }
}
