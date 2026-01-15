<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrders } from '../composables/useOrders'
import StatusBadge from '../../../shared/components/StatusBadge.vue'
import { OrderStatus } from '../types'

const route = useRoute()
const router = useRouter()
const { currentOrder, loading, error, fetchOrderById, updateOrderStatus, cancelOrder } = useOrders()

const selectedStatus = ref<OrderStatus | ''>('')
const showConfirmCancel = ref(false)

onMounted(() => {
  const orderId = route.params.id as string
  fetchOrderById(orderId)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

async function handleStatusUpdate() {
  if (!selectedStatus.value || !currentOrder.value) return

  try {
    await updateOrderStatus(currentOrder.value.id, { newStatus: selectedStatus.value })
    selectedStatus.value = ''
  } catch (err) {
    console.error('Erro ao atualizar status:', err)
  }
}

async function handleCancel() {
  if (!currentOrder.value) return

  try {
    await cancelOrder(currentOrder.value.id)
    router.push('/')
  } catch (err) {
    console.error('Erro ao cancelar pedido:', err)
    showConfirmCancel.value = false
  }
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="currentOrder" class="bg-white shadow-md rounded-lg p-6">
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Detalhes do Pedido</h1>
        <button
          @click="goBack"
          class="text-gray-600 hover:text-gray-800"
        >
          Voltar
        </button>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 class="text-sm font-medium text-gray-500 mb-1">ID do Pedido</h2>
          <p class="font-mono text-sm text-gray-900">{{ currentOrder.id }}</p>
        </div>

        <div>
          <h2 class="text-sm font-medium text-gray-500 mb-1">Status</h2>
          <StatusBadge :status="currentOrder.status" />
        </div>

        <div>
          <h2 class="text-sm font-medium text-gray-500 mb-1">Cliente</h2>
          <p class="text-gray-900">{{ currentOrder.customerName }}</p>
        </div>

        <div>
          <h2 class="text-sm font-medium text-gray-500 mb-1">Email</h2>
          <p class="text-gray-900">{{ currentOrder.customerEmail }}</p>
        </div>

        <div>
          <h2 class="text-sm font-medium text-gray-500 mb-1">Data de Criação</h2>
          <p class="text-gray-900">{{ formatDate(currentOrder.createdAt) }}</p>
        </div>

        <div v-if="currentOrder.updatedAt">
          <h2 class="text-sm font-medium text-gray-500 mb-1">Última Atualização</h2>
          <p class="text-gray-900">{{ formatDate(currentOrder.updatedAt) }}</p>
        </div>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Itens do Pedido</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unit.</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in currentOrder.items" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.productName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.quantity }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.unitPrice) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formatCurrency(item.subtotal) }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="3" class="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{{ formatCurrency(currentOrder.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Ações</h2>

        <div class="flex gap-4 items-end mb-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Atualizar Status</label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um status</option>
              <option :value="OrderStatus.Confirmed">Confirmado</option>
              <option :value="OrderStatus.Processing">Processando</option>
              <option :value="OrderStatus.Completed">Concluído</option>
              <option :value="OrderStatus.Cancelled">Cancelado</option>
            </select>
          </div>
          <button
            @click="handleStatusUpdate"
            :disabled="!selectedStatus"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Atualizar
          </button>
        </div>

        <div v-if="!showConfirmCancel">
          <button
            @click="showConfirmCancel = true"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Cancelar Pedido
          </button>
        </div>

        <div v-else class="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p class="text-red-800 mb-3">Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.</p>
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Confirmar Cancelamento
            </button>
            <button
              @click="showConfirmCancel = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
