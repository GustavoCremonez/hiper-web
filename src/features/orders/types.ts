export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Processing = 'Processing',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt?: string
}

export interface CreateOrderItemRequest {
  productName: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  items: CreateOrderItemRequest[]
}

export interface UpdateStatusRequest {
  newStatus: OrderStatus
}
