import { ref } from 'vue'

export function useNotifications() {
  const permission = ref<NotificationPermission>('default')

  async function requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações desktop')
      return false
    }

    if (Notification.permission === 'granted') {
      permission.value = 'granted'
      return true
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    }

    permission.value = Notification.permission
    return false
  }

  function showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      return notification
    }
    return null
  }

  function notifyOrderCreated(orderId: string, customerName: string) {
    return showNotification('Pedido Criado', {
      body: `Pedido de ${customerName} criado com sucesso!`,
      tag: `order-${orderId}`,
      requireInteraction: false
    })
  }

  function notifyOrderStatusChanged(orderId: string, oldStatus: string, newStatus: string) {
    const statusLabels: Record<string, string> = {
      'Pending': 'Pendente',
      'Confirmed': 'Confirmado',
      'Processing': 'Em Processamento',
      'Completed': 'Concluído',
      'Cancelled': 'Cancelado'
    }

    return showNotification('Status Atualizado', {
      body: `Pedido mudou de ${statusLabels[oldStatus]} para ${statusLabels[newStatus]}`,
      tag: `order-${orderId}`,
      requireInteraction: false
    })
  }

  function notifyOrderCancelled(orderId: string) {
    return showNotification('Pedido Cancelado', {
      body: `O pedido foi cancelado com sucesso`,
      tag: `order-${orderId}`,
      requireInteraction: false
    })
  }

  return {
    permission,
    requestPermission,
    showNotification,
    notifyOrderCreated,
    notifyOrderStatusChanged,
    notifyOrderCancelled
  }
}
