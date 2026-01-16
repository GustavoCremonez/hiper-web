<script setup lang="ts">
import type { Order, OrderStatus } from '../types'
import StatusBadge from '../../../shared/components/StatusBadge.vue'
import { OrderStatus as OrderStatusEnum } from '../types'

interface Props {
  orders: Order[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  viewOrder: [id: string]
  statusChange: [orderId: string, newStatus: OrderStatus]
}>()

function truncateId(id: string) {
  return id.substring(0, 8) + '...'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function handleStatusChange(orderId: string, event: Event) {
  const select = event.target as HTMLSelectElement
  const newStatus = select.value as OrderStatus
  if (newStatus) {
    emit('statusChange', orderId, newStatus)
    select.value = ''
  }
}
</script>

<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
            {{ truncateId(order.id) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
            <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(order.createdAt) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <StatusBadge :status="order.status" />
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ formatCurrency(order.total) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="emit('viewOrder', order.id)"
              class="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
            >
              Ver
            </button>
            <select
              @change="(e) => handleStatusChange(order.id, e)"
              class="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Atualizar Status</option>
              <option :value="OrderStatusEnum.Confirmed">Confirmado</option>
              <option :value="OrderStatusEnum.Processing">Processando</option>
              <option :value="OrderStatusEnum.Completed">Concluído</option>
              <option :value="OrderStatusEnum.Cancelled">Cancelado</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
