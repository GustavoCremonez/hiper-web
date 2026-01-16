import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OrdersTable from './OrdersTable.vue'
import StatusBadge from '../../../shared/components/StatusBadge.vue'
import { OrderStatus } from '../types'
import type { Order } from '../types'

describe('OrdersTable', () => {
  const mockOrders: Order[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      customerName: 'João Silva',
      customerEmail: 'joao@example.com',
      status: OrderStatus.Pending,
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          orderId: '123e4567-e89b-12d3-a456-426614174000',
          productName: 'Produto A',
          quantity: 2,
          unitPrice: 50.0,
          subtotal: 100.0
        }
      ],
      total: 100.0,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      customerName: 'Maria Santos',
      customerEmail: 'maria@example.com',
      status: OrderStatus.Confirmed,
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          orderId: '123e4567-e89b-12d3-a456-426614174002',
          productName: 'Produto B',
          quantity: 1,
          unitPrice: 150.0,
          subtotal: 150.0
        }
      ],
      total: 150.0,
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    }
  ]

  it('deve renderizar tabela com pedidos', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: mockOrders },
      global: {
        components: { StatusBadge }
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('deve exibir loading spinner quando loading é true', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [], loading: true },
      global: {
        components: { StatusBadge }
      }
    })

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('deve exibir informações do pedido corretamente', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('João Silva')
    expect(firstRow.text()).toContain('joao@example.com')
    expect(firstRow.text()).toContain('R$')
  })

  it('deve truncar ID do pedido', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const idCell = wrapper.find('.font-mono')
    expect(idCell.text()).toMatch(/^.{8}\.\.\./)
    expect(idCell.text().length).toBeLessThanOrEqual(11)
  })

  it('deve formatar data corretamente', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const dateCell = wrapper.findAll('td')[2]
    expect(dateCell.text()).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('deve formatar valor monetário corretamente', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const totalCell = wrapper.findAll('td')[4]
    expect(totalCell.text()).toMatch(/R\$\s*100,00/)
  })

  it('deve emitir evento viewOrder ao clicar no botão Ver', async () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const viewButton = wrapper.find('button')
    await viewButton.trigger('click')

    expect(wrapper.emitted('viewOrder')).toBeTruthy()
    expect(wrapper.emitted('viewOrder')?.[0]).toEqual([mockOrders[0].id])
  })

  it('deve emitir evento statusChange ao alterar status', async () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const select = wrapper.find('select')
    await select.setValue(OrderStatus.Confirmed)

    expect(wrapper.emitted('statusChange')).toBeTruthy()
    expect(wrapper.emitted('statusChange')?.[0]).toEqual([
      mockOrders[0].id,
      OrderStatus.Confirmed
    ])
  })

  it('não deve emitir statusChange se valor vazio for selecionado', async () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const select = wrapper.find('select')
    await select.setValue('')

    expect(wrapper.emitted('statusChange')).toBeFalsy()
  })

  it('deve renderizar StatusBadge para cada pedido', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: mockOrders },
      global: {
        components: { StatusBadge }
      }
    })

    const statusBadges = wrapper.findAllComponents(StatusBadge)
    expect(statusBadges).toHaveLength(2)
    expect(statusBadges[0].props('status')).toBe(OrderStatus.Pending)
    expect(statusBadges[1].props('status')).toBe(OrderStatus.Confirmed)
  })

  it('deve aplicar classe hover nas linhas', () => {
    const wrapper = mount(OrdersTable, {
      props: { orders: [mockOrders[0]] },
      global: {
        components: { StatusBadge }
      }
    })

    const row = wrapper.find('tbody tr')
    expect(row.classes()).toContain('hover:bg-gray-50')
  })
})
