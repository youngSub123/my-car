<script setup>
import { computed } from 'vue'
import { useMaintenanceStore } from '@/stores/useMaintenanceStore'

const maintenance = useMaintenanceStore()

const alerts = computed(() => {
  const list = maintenance.mileageAlerts.map((r) => ({
    key: r.id,
    text:
      r.remainingKm <= 0
        ? `${r.category} 교체 시기가 지났습니다 (${Math.abs(r.remainingKm)}km 초과).`
        : `${r.category} 교체 시기가 ${r.remainingKm}km 남았습니다.`,
  }))

  if (maintenance.insuranceAlert) {
    list.push({
      key: 'insurance',
      text:
        maintenance.insuranceAlert.days <= 0
          ? '보험 만기일이 지났습니다. 갱신을 확인하세요.'
          : `보험 만기일이 ${maintenance.insuranceAlert.days}일 남았습니다.`,
    })
  }

  if (maintenance.inspectionAlert) {
    list.push({
      key: 'inspection',
      text:
        maintenance.inspectionAlert.days <= 0
          ? '자동차 정기검사 기한이 지났습니다. 서둘러 검사를 받으세요.'
          : `자동차 정기검사 기한이 ${maintenance.inspectionAlert.days}일 남았습니다.`,
    })
  }

  return list
})
</script>

<template>
  <div class="card">
    <p class="card-title">긴급 알림</p>
    <ul v-if="alerts.length" class="alert-list">
      <li v-for="alert in alerts" :key="alert.key" class="alert-item">
        <span class="alert-dot" />
        {{ alert.text }}
      </li>
    </ul>
    <p v-else class="empty">현재 예정된 알림이 없습니다.</p>
  </div>
</template>

<style scoped>
.alert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text);
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-warning);
  flex-shrink: 0;
}

.empty {
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
