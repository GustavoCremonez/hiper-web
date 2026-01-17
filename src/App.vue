<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotifications } from './composables/useNotifications'
import ToastContainer from './components/ToastContainer.vue'

const { requestPermission } = useNotifications()
const showNotificationBanner = ref(false)

onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    showNotificationBanner.value = true
  }
})

async function handleEnableNotifications() {
  const granted = await requestPermission()
  if (granted) {
    showNotificationBanner.value = false
  }
}

function handleDismissBanner() {
  showNotificationBanner.value = false
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div v-if="showNotificationBanner" class="bg-blue-600 text-white px-4 py-3 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="font-medium">Ative as notificações para receber atualizações sobre seus pedidos</span>
        </div>
        <div class="flex items-center gap-2">
          <button @click="handleEnableNotifications" class="bg-white text-blue-600 px-4 py-1.5 rounded font-medium hover:bg-gray-100 transition-colors">
            Ativar
          </button>
          <button @click="handleDismissBanner" class="text-white hover:text-gray-200 px-2 py-1.5 transition-colors">
            Agora não
          </button>
        </div>
      </div>
    </div>
    <router-view />
    <ToastContainer />
  </div>
</template>
