<script setup>
import { computed } from 'vue'
import { useVehicleStore } from '@/stores/useVehicleStore'

const vehicle = useVehicleStore()

const fixedMilestones = [100, 200, 365]

const nextMilestone = computed(() => {
  const days = vehicle.daysWithoutAccident
  const fixed = fixedMilestones.find((m) => m > days)
  if (fixed) return fixed
  // 365일을 넘으면 100일 단위로 다음 목표를 계속 갱신
  return Math.ceil((days + 1) / 100) * 100
})

const progress = computed(() => {
  return Math.min(100, Math.round((vehicle.daysWithoutAccident / nextMilestone.value) * 100))
})

const circumference = 2 * Math.PI * 42

const dashOffset = computed(() => circumference - (progress.value / 100) * circumference)
</script>

<template>
  <div class="card accident-free">
    <p class="card-title">무사고 트래커</p>
    <div class="ring-wrap">
      <svg viewBox="0 0 100 100" class="ring">
        <circle class="ring-bg" cx="50" cy="50" r="42" />
        <circle
          class="ring-fg"
          cx="50"
          cy="50"
          r="42"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <div class="ring-center">
        <span class="days">{{ vehicle.daysWithoutAccident }}</span>
        <span class="unit">일</span>
      </div>
    </div>
    <p class="milestone-label">다음 목표까지 {{ nextMilestone - vehicle.daysWithoutAccident }}일 남음 (D-{{ nextMilestone }})</p>
  </div>
</template>

<style scoped>
.accident-free {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ring-wrap {
  position: relative;
  width: 140px;
  height: 140px;
}

.ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--color-surface-alt);
  stroke-width: 8;
}

.ring-fg {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.4s ease;
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.days {
  font-size: 28px;
  font-weight: 700;
}

.unit {
  font-size: 12px;
  color: var(--color-text-muted);
}

.milestone-label {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
