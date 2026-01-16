import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOrders } from './useOrders'
import { orderService } from '../services/orderService'
import { OrderStatus } from '../types'
import type { Order, CreateOrderRequest, PagedResult } from '../types'

vi.mock('../services/orderService')
vi.mock('../../../composables/useNotifications', () => ({
  useNotifications: () => ({
    notifyOrderCreated: vi.fn(),
    notifyOrderStatusChanged: vi.fn(),
    notifyOrderCancelled: vi.fn()
  })
}))

describe('useOrders', () => {
  const mockOrder: Order = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    customerName: 'João Silva',
    customerEmail: 'joao@example.com',
    status: OrderStatus.Pending,
    items: [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        productName: 'Produto A',
        quantity: 2,
        unitPrice: 50.0,
        subtotal: 100.0
      }
    ],
    total: 100.0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }

  const mockPagedResult: PagedResult<Order> = {
    items: [mockOrder],
    totalCount: 1,
    page: 1,
    pageSize: 10,
    totalPages: 1
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchOrders', () => {
    it('deve buscar pedidos com sucesso', async () => {
      vi.mocked(orderService.getAll).mockResolvedValue(mockPagedResult)

      const { orders, loading, error, fetchOrders, currentPage, totalPages, totalCount } = useOrders()

      expect(loading.value).toBe(false)
      await fetchOrders()

      expect(orderService.getAll).toHaveBeenCalledWith(1, 10)
      expect(orders.value).toEqual([mockOrder])
      expect(currentPage.value).toBe(1)
      expect(totalPages.value).toBe(1)
      expect(totalCount.value).toBe(1)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('deve tratar erro ao buscar pedidos', async () => {
      vi.mocked(orderService.getAll).mockRejectedValue(new Error('Network error'))

      const { orders, loading, error, fetchOrders } = useOrders()

      await fetchOrders()

      expect(orders.value).toEqual([])
      expect(error.value).toBe('Erro ao carregar pedidos')
      expect(loading.value).toBe(false)
    })

    it('deve buscar pedidos de página específica', async () => {
      vi.mocked(orderService.getAll).mockResolvedValue(mockPagedResult)

      const { fetchOrders } = useOrders()

      await fetchOrders(2)

      expect(orderService.getAll).toHaveBeenCalledWith(2, 10)
    })
  })

  describe('fetchOrderById', () => {
    it('deve buscar pedido por ID com sucesso', async () => {
      vi.mocked(orderService.getById).mockResolvedValue(mockOrder)

      const { currentOrder, loading, error, fetchOrderById } = useOrders()

      await fetchOrderById(mockOrder.id)

      expect(orderService.getById).toHaveBeenCalledWith(mockOrder.id)
      expect(currentOrder.value).toEqual(mockOrder)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('deve tratar erro ao buscar pedido por ID', async () => {
      vi.mocked(orderService.getById).mockRejectedValue(new Error('Not found'))

      const { currentOrder, error, fetchOrderById } = useOrders()

      await fetchOrderById('invalid-id')

      expect(currentOrder.value).toBe(null)
      expect(error.value).toBe('Erro ao carregar pedido')
    })
  })

  describe('createOrder', () => {
    it('deve criar pedido com sucesso', async () => {
      const request: CreateOrderRequest = {
        customerName: 'João Silva',
        customerEmail: 'joao@example.com',
        items: [
          { productName: 'Produto A', quantity: 2, unitPrice: 50.0 }
        ]
      }

      vi.mocked(orderService.create).mockResolvedValue(mockOrder)

      const { createOrder, loading, error } = useOrders()

      const orderId = await createOrder(request)

      expect(orderService.create).toHaveBeenCalledWith(request)
      expect(orderId).toBe(mockOrder.id)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('deve tratar erro ao criar pedido', async () => {
      const request: CreateOrderRequest = {
        customerName: 'João Silva',
        customerEmail: 'joao@example.com',
        items: [
          { productName: 'Produto A', quantity: 2, unitPrice: 50.0 }
        ]
      }

      vi.mocked(orderService.create).mockRejectedValue(new Error('Validation error'))

      const { createOrder, error } = useOrders()

      await expect(createOrder(request)).rejects.toThrow()
      expect(error.value).toBe('Erro ao criar pedido')
    })
  })

  describe('updateOrderStatus', () => {
    it('deve atualizar status do pedido com sucesso', async () => {
      const updatedOrder = { ...mockOrder, status: OrderStatus.Confirmed }
      vi.mocked(orderService.updateStatus).mockResolvedValue(updatedOrder)

      const { orders, currentOrder, updateOrderStatus, fetchOrders } = useOrders()

      vi.mocked(orderService.getAll).mockResolvedValue(mockPagedResult)
      await fetchOrders()

      await updateOrderStatus(mockOrder.id, { newStatus: OrderStatus.Confirmed })

      expect(orderService.updateStatus).toHaveBeenCalledWith(mockOrder.id, { newStatus: OrderStatus.Confirmed })
      expect(currentOrder.value).toEqual(updatedOrder)
      expect(orders.value[0].status).toBe(OrderStatus.Confirmed)
    })

    it('deve tratar erro ao atualizar status', async () => {
      vi.mocked(orderService.updateStatus).mockRejectedValue(new Error('Invalid transition'))

      const { updateOrderStatus, error } = useOrders()

      await expect(updateOrderStatus(mockOrder.id, { newStatus: OrderStatus.Confirmed })).rejects.toThrow()
      expect(error.value).toBe('Erro ao atualizar status')
    })
  })

  describe('cancelOrder', () => {
    it('deve cancelar pedido com sucesso', async () => {
      vi.mocked(orderService.cancel).mockResolvedValue(undefined)

      const { orders, currentOrder, cancelOrder, fetchOrders } = useOrders()

      vi.mocked(orderService.getAll).mockResolvedValue(mockPagedResult)
      await fetchOrders()

      currentOrder.value = mockOrder

      await cancelOrder(mockOrder.id)

      expect(orderService.cancel).toHaveBeenCalledWith(mockOrder.id)
      expect(orders.value).toEqual([])
      expect(currentOrder.value).toBe(null)
    })

    it('deve tratar erro ao cancelar pedido', async () => {
      vi.mocked(orderService.cancel).mockRejectedValue(new Error('Cannot cancel'))

      const { cancelOrder, error } = useOrders()

      await expect(cancelOrder(mockOrder.id)).rejects.toThrow()
      expect(error.value).toBe('Erro ao cancelar pedido')
    })
  })
})
