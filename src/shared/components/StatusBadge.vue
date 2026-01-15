<script setup lang="ts">
import { computed } from 'vue'
import { OrderStatus } from '../../features/orders/types'

interface Props {
  status: OrderStatus
}

const props = defineProps<Props>()

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'

  const statusClasses = {
    [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.Confirmed]: 'bg-blue-100 text-blue-800',
    [OrderStatus.Processing]: 'bg-purple-100 text-purple-800',
    [OrderStatus.Completed]: 'bg-green-100 text-green-800',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800'
  }

  return `${baseClasses} ${statusClasses[props.status]}`
})

const statusLabel = computed(() => {
  const labels = {
    [OrderStatus.Pending]: 'Pendente',
    [OrderStatus.Confirmed]: 'Confirmado',
    [OrderStatus.Processing]: 'Processando',
    [OrderStatus.Completed]: 'Concluído',
    [OrderStatus.Cancelled]: 'Cancelado'
  }

  return labels[props.status]
})
</script>

<template>
  <span :class="badgeClasses">{{ statusLabel }}</span>
</template>
