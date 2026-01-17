import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message: string
  duration: number
}

const toasts = ref<Toast[]>([])

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
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: string) {
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
    toasts.value = []
  }

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
