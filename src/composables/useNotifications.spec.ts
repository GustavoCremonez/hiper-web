import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotifications } from './useNotifications'

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted')
    } as any

    vi.stubGlobal('Notification', global.Notification)
  })

  describe('requestPermission', () => {
    it('deve retornar true quando permissão já foi concedida', async () => {
      global.Notification.permission = 'granted'

      const { requestPermission } = useNotifications()
      const result = await requestPermission()

      expect(result).toBe(true)
    })

    it('deve solicitar permissão quando status é default', async () => {
      global.Notification.permission = 'default'
      const mockRequestPermission = vi.fn().mockResolvedValue('granted')
      global.Notification.requestPermission = mockRequestPermission

      const { requestPermission } = useNotifications()
      const result = await requestPermission()

      expect(mockRequestPermission).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('deve retornar false quando permissão é negada', async () => {
      global.Notification.permission = 'denied'

      const { requestPermission } = useNotifications()
      const result = await requestPermission()

      expect(result).toBe(false)
    })

    it('deve retornar false quando Notification não está disponível', async () => {
      delete (global as any).Notification

      const { requestPermission } = useNotifications()
      const result = await requestPermission()

      expect(result).toBe(false)
    })
  })

  describe('showNotification', () => {
    it('deve retornar null quando permissão não está concedida', () => {
      global.Notification.permission = 'denied'

      const { showNotification } = useNotifications()
      const notification = showNotification('Título')

      expect(notification).toBeNull()
    })
  })
})
