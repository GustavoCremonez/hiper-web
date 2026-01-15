import axios from 'axios'
import type { Order, CreateOrderRequest, UpdateStatusRequest } from '../types'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders')
    return response.data
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`)
    return response.data
  },

  async create(request: CreateOrderRequest): Promise<string> {
    const response = await api.post<string>('/orders', request)
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
