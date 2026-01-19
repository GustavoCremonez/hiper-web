import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { Order, CreateOrderRequest, UpdateStatusRequest, PagedResult } from '../types'
import type { ApiErrorResponse } from '../../../types/api'
import type { useToast } from '../../../composables/useToast'

const API_URL = '/api'

function createApiClient(toast: ReturnType<typeof useToast>): AxiosInstance {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response) {
        const errorData = error.response.data

        if (errorData.code === 'VALIDATION_ERROR' && errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([, messages]) => `${messages.join(', ')}`)
            .join('; ')

          toast.error('Atenção', errorMessages)
        } else if (errorData.code === 'NOT_FOUND') {
          toast.error('Não Encontrado', errorData.message)
        } else if (errorData.code === 'BUSINESS_RULE_VIOLATION') {
          toast.warning('Atenção', errorData.message)
        } else {
          toast.error('Erro', errorData.message || 'Ocorreu um erro inesperado')
        }
      } else if (error.request) {
        toast.error('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.')
      } else {
        toast.error('Erro', 'Ocorreu um erro inesperado ao processar a requisição.')
      }

      return Promise.reject(error)
    }
  )

  return api
}

export function createOrderService(toast: ReturnType<typeof useToast>) {
  const api = createApiClient(toast)

  return {
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
}
