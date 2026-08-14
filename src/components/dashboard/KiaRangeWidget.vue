<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useKiaStore } from '@/stores/useKiaStore'

const kia = useKiaStore()
const router = useRouter()

onMounted(() => {
  kia.fetchVehicleData()
})

function goToSettings() {
  router.push('/settings')
}
</script>

<template>
  <div class="card kia-range">
    <p class="card-title">기아 커넥트 · 주행 가능 거리</p>

    <div v-if="kia.isLoading" class="state-text">불러오는 중...</div>

    <div v-else-if="!kia.connected" class="state-empty">
      <p class="state-text">아직 연동되지 않았어요.</p>
      <button class="btn-ghost" @click="goToSettings">설정에서 연동하기</button>
    </div>

    <div v-else-if="kia.error" class="state-text error-text">{{ kia.friendlyError }}</div>

    <div v-else class="range-display">
      <span class="range-value">{{ kia.distanceLabel }}</span>
      <span v-if="kia.updatedAt" class="range-updated">기준 시각 {{ kia.updatedAt }}</span>
    </div>
  </div>
</template>

<style scoped>
.kia-range {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.state-text {
  font-size: 13px;
  color: var(--color-text-muted);
}

.state-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.error-text {
  color: var(--color-danger);
}

.range-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.range-value {
  font-size: 28px;
  font-weight: 700;
}

.range-updated {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
