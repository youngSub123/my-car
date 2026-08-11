<script setup>
import { computed, onMounted } from 'vue'
import TheSidebar from '@/components/common/TheSidebar.vue'
import { useVehicleStore } from '@/stores/useVehicleStore'
import { useMaintenanceStore } from '@/stores/useMaintenanceStore'

const vehicle = useVehicleStore()
const maintenance = useMaintenanceStore()

const error = computed(() => vehicle.error || maintenance.error)

onMounted(async () => {
  await vehicle.fetchVehicle()
  await maintenance.fetchRecords()
})
</script>

<template>
  <div class="app-shell">
    <TheSidebar />
    <main class="app-main">
      <p v-if="error" class="error-banner">
        Supabase 연결 오류: {{ error }} — .env의 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 확인하세요.
      </p>
      <p v-else-if="vehicle.isLoading" class="loading">불러오는 중...</p>
      <RouterView v-else />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  min-width: 0;
  padding: 32px;
}

.error-banner {
  background: rgba(240, 89, 107, 0.12);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
}

.loading {
  color: var(--color-text-muted);
}

@media (max-width: 720px) {
  .app-shell {
    flex-direction: column;
  }

  .app-main {
    padding: 20px;
  }
}
</style>
