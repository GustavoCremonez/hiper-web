import { ref } from 'vue'
import { orderService } from '../services/orderService'
import type { Order, CreateOrderRequest, UpdateStatusRequest } from '../types'

export function useOrders() {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)
  const totalCount = ref(0)

  async function fetchOrders(page: number = 1) {
    loading.value = true
    error.value = null
    try {
      const result = await orderService.getAll(page, pageSize.value)
      orders.value = result.items
      currentPage.value = result.page
      totalPages.value = result.totalPages
      totalCount.value = result.totalCount
    } catch (err) {
      error.value = 'Erro ao carregar pedidos'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentOrder.value = await orderService.getById(id)
    } catch (err) {
      error.value = 'Erro ao carregar pedido'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createOrder(request: CreateOrderRequest) {
    loading.value = true
    error.value = null
    try {
      const order = await orderService.create(request)
      return order.id
    } catch (err) {
      error.value = 'Erro ao criar pedido'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(id: string, request: UpdateStatusRequest) {
    loading.value = true
    error.value = null
    try {
      const updatedOrder = await orderService.updateStatus(id, request)
      currentOrder.value = updatedOrder
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
    } catch (err) {
      error.value = 'Erro ao atualizar status'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(id: string) {
    loading.value = true
    error.value = null
    try {
      await orderService.cancel(id)
      orders.value = orders.value.filter(o => o.id !== id)
      if (currentOrder.value?.id === id) {
        currentOrder.value = null
      }
    } catch (err) {
      error.value = 'Erro ao cancelar pedido'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder
  }
}
