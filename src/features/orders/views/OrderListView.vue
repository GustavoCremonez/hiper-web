<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrders } from '../composables/useOrders'
import StatusBadge from '../../../shared/components/StatusBadge.vue'
import { OrderStatus } from '../types'

const router = useRouter()
const { orders, loading, error, currentPage, totalPages, totalCount, fetchOrders, updateOrderStatus } = useOrders()

onMounted(() => {
  fetchOrders()
})

function viewOrder(id: string) {
  router.push(`/orders/${id}`)
}

function createOrder() {
  router.push('/orders/new')
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

function truncateId(id: string) {
  return id.substring(0, 8) + '...'
}

async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
  try {
    await updateOrderStatus(orderId, { newStatus })
  } catch (err) {
    console.error('Erro ao atualizar status:', err)
  }
}

async function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    await fetchOrders(page)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Pedidos</h1>
      <button
        @click="createOrder"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Novo Pedido
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">Nenhum pedido encontrado</p>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
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
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{{ truncateId(order.id) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
              <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge :status="order.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formatCurrency(order.total) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="viewOrder(order.id)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Ver
              </button>
              <select
                @change="(e) => handleStatusChange(order.id, (e.target as HTMLSelectElement).value as OrderStatus)"
                class="text-sm border-gray-300 rounded"
              >
                <option value="">Atualizar Status</option>
                <option :value="OrderStatus.Confirmed">Confirmado</option>
                <option :value="OrderStatus.Processing">Processando</option>
                <option :value="OrderStatus.Completed">Concluído</option>
                <option :value="OrderStatus.Cancelled">Cancelado</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
