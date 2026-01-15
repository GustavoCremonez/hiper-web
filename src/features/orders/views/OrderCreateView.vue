<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrders } from '../composables/useOrders'
import type { CreateOrderItemRequest } from '../types'

const router = useRouter()
const { createOrder, loading, error } = useOrders()

const customerName = ref('')
const customerEmail = ref('')
const items = ref<CreateOrderItemRequest[]>([
  { productName: '', quantity: 1, unitPrice: 0 }
])

const validationErrors = ref<Record<string, string>>({})

function addItem() {
  items.value.push({ productName: '', quantity: 1, unitPrice: 0 })
}

function removeItem(index: number) {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

function calculateTotal() {
  return items.value.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function validate() {
  validationErrors.value = {}

  if (!customerName.value.trim()) {
    validationErrors.value.customerName = 'Nome do cliente é obrigatório'
  }

  if (!customerEmail.value.trim()) {
    validationErrors.value.customerEmail = 'Email do cliente é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.value)) {
    validationErrors.value.customerEmail = 'Email inválido'
  }

  items.value.forEach((item, index) => {
    if (!item.productName.trim()) {
      validationErrors.value[`item_${index}_name`] = 'Nome do produto é obrigatório'
    }
    if (item.quantity < 1) {
      validationErrors.value[`item_${index}_quantity`] = 'Quantidade deve ser maior ou igual a 1'
    }
    if (item.unitPrice <= 0) {
      validationErrors.value[`item_${index}_price`] = 'Preço deve ser maior que zero'
    }
  })

  return Object.keys(validationErrors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  try {
    const orderId = await createOrder({
      customerName: customerName.value,
      customerEmail: customerEmail.value,
      items: items.value
    })
    router.push(`/orders/${orderId}`)
  } catch (err) {
    console.error('Erro ao criar pedido:', err)
  }
}

function cancel() {
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Novo Pedido</h1>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Dados do Cliente</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input
            v-model="customerName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': validationErrors.customerName }"
          />
          <p v-if="validationErrors.customerName" class="text-red-500 text-sm mt-1">
            {{ validationErrors.customerName }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="customerEmail"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': validationErrors.customerEmail }"
          />
          <p v-if="validationErrors.customerEmail" class="text-red-500 text-sm mt-1">
            {{ validationErrors.customerEmail }}
          </p>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Itens do Pedido</h2>
          <button
            type="button"
            @click="addItem"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Adicionar Item
          </button>
        </div>

        <div
          v-for="(item, index) in items"
          :key="index"
          class="mb-4 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-gray-700">Item {{ index + 1 }}</h3>
            <button
              v-if="items.length > 1"
              type="button"
              @click="removeItem(index)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Remover
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Produto</label>
              <input
                v-model="item.productName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': validationErrors[`item_${index}_name`] }"
              />
              <p v-if="validationErrors[`item_${index}_name`]" class="text-red-500 text-sm mt-1">
                {{ validationErrors[`item_${index}_name`] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': validationErrors[`item_${index}_quantity`] }"
              />
              <p v-if="validationErrors[`item_${index}_quantity`]" class="text-red-500 text-sm mt-1">
                {{ validationErrors[`item_${index}_quantity`] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preço Unitário</label>
              <input
                v-model.number="item.unitPrice"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': validationErrors[`item_${index}_price`] }"
              />
              <p v-if="validationErrors[`item_${index}_price`]" class="text-red-500 text-sm mt-1">
                {{ validationErrors[`item_${index}_price`] }}
              </p>
            </div>

            <div class="flex items-end">
              <p class="text-sm text-gray-600">
                Subtotal: <span class="font-medium">{{ formatCurrency(item.quantity * item.unitPrice) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-lg font-semibold text-gray-800">
          Total: <span class="text-blue-600">{{ formatCurrency(calculateTotal()) }}</span>
        </p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          :disabled="loading"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? 'Criando...' : 'Criar Pedido' }}
        </button>
      </div>
    </form>
  </div>
</template>
