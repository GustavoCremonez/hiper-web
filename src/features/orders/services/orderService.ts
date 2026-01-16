import axios from 'axios'
import type { Order, CreateOrderRequest, UpdateStatusRequest, PagedResult } from '../types'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const orderService = {
  async getAll(page: number = 1, pageSize: number = 10): Promise<PagedResult<Order>> {
    const response = await api.get<PagedResult<Order>>('/orders', {
      params: { page, pageSize }
    })
    return response.data
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`)
    return response.data
  },

  async create(request: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>('/orders', request)
    return response.data
  },

  async updateStatus(id: string, request: UpdateStatusRequest): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/status`, request)
    return response.data
  },

  async cancel(id: string): Promise<void> {
    await api.delete(`/orders/${id}`)
  }
}
