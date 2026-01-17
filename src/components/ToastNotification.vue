<script setup lang="ts">
import { computed } from 'vue'
import type { Toast } from '../composables/useToast'
import { useToast } from '../composables/useToast'

interface Props {
  toast: Toast
}

const props = defineProps<Props>()
const { removeToast } = useToast()

const bgColor = computed(() => {
  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }
  return colors[props.toast.type]
})

const textColor = computed(() => {
  const colors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return colors[props.toast.type]
})

const iconColor = computed(() => {
  const colors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }
  return colors[props.toast.type]
})

const icon = computed(() => {
  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[props.toast.type]
})
</script>

<template>
  <div
    :class="[bgColor, 'border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md']"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <div :class="iconColor" class="flex-shrink-0 mt-0.5">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p :class="[textColor, 'font-semibold text-sm mb-1']">
          {{ toast.title }}
        </p>
        <p :class="[textColor, 'text-sm opacity-90']">
          {{ toast.message }}
        </p>
      </div>

      <button
        @click="removeToast(toast.id)"
        :class="[textColor, 'flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity']"
        type="button"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
