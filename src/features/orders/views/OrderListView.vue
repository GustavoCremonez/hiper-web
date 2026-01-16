<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrders } from '../composables/useOrders'
import OrdersTable from '../components/OrdersTable.vue'
import type { OrderStatus } from '../types'

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

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div v-else-if="!loading && (!orders || orders.length === 0)" class="bg-white shadow-md rounded-lg p-12 text-center">
      <p class="text-gray-500 text-lg">Nenhum pedido encontrado</p>
    </div>

    <OrdersTable
      v-else
      :orders="orders || []"
      :loading="loading"
      @view-order="viewOrder"
      @status-change="handleStatusChange"
    />

    <div v-if="!loading && orders && orders.length > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Mostrando {{ orders.length }} de {{ totalCount }} pedidos
      </div>
      <div class="flex gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Anterior
        </button>
        <div class="flex items-center px-4 py-2 border rounded-lg bg-gray-50">
          Página {{ currentPage }} de {{ totalPages }}
        </div>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>
