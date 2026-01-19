import { ref, onScopeDispose } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message: string
  duration: number
}

const toasts = ref<Toast[]>([])
const timerIds = new Map<string, number>()

export function useToast() {
  function addToast(type: ToastType, title: string, message: string, duration: number = 5000) {
    const id = `toast-${Date.now()}-${Math.random()}`

    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration
    }

    toasts.value.push(toast)

    if (duration > 0) {
      const timerId = window.setTimeout(() => {
        removeToast(id)
      }, duration)

      timerIds.set(id, timerId)
    }

    return id
  }

  function removeToast(id: string) {
    const timerId = timerIds.get(id)
    if (timerId !== undefined) {
      clearTimeout(timerId)
      timerIds.delete(id)
    }

    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(title: string, message: string, duration?: number) {
    return addToast('success', title, message, duration)
  }

  function error(title: string, message: string, duration?: number) {
    return addToast('error', title, message, duration || 7000)
  }

  function warning(title: string, message: string, duration?: number) {
    return addToast('warning', title, message, duration)
  }

  function info(title: string, message: string, duration?: number) {
    return addToast('info', title, message, duration)
  }

  function clear() {
    timerIds.forEach(timerId => clearTimeout(timerId))
    timerIds.clear()
    toasts.value = []
  }

  onScopeDispose(() => {
    timerIds.forEach(timerId => clearTimeout(timerId))
    timerIds.clear()
  })

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
    clear
  }
}
