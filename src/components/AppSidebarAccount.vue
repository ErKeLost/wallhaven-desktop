<script setup lang="ts">
const emit = defineEmits<{ change: [string] }>()
import { config } from '@/config'

const options = computed(() => config.sidebar.account.options)
</script>

<template>
  <var-menu-select
    class="w-full"
    placement="right-end"
    :offset-x="14"
    @update:model-value="(value) => emit('change', value)"
  >
    <template #options>
      <div class="p-3 space-y-2">
        <div class="text-lg text-secondary">Haoziqaq</div>
        <div class="text-md text-tertiary">357229046@qq.com</div>
      </div>

      <var-divider margin="0" />

      <var-menu-option
        v-for="option in options"
        :key="option.label"
        :label="option.label"
        :value="option.value"
      />
    </template>

    <var-button class="transition! rounded-2! h-17! w-full" text>
      <var-avatar src="@/assets/images/avatar.jpg" />
    </var-button>
  </var-menu-select>
</template>
