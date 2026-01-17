<script setup lang="ts">
import { useToast } from '../composables/useToast'
import ToastNotification from './ToastNotification.vue'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
    <TransitionGroup name="toast">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
