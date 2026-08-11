<script setup>
import { ref } from 'vue'
import { useVehicleStore } from '@/stores/useVehicleStore'
import AccidentFreeWidget from '@/components/dashboard/AccidentFreeWidget.vue'
import AlertWidget from '@/components/dashboard/AlertWidget.vue'
import CostChartWidget from '@/components/dashboard/CostChartWidget.vue'

const vehicle = useVehicleStore()

const isEditingMileage = ref(false)
const mileageDraft = ref(vehicle.currentMileage)

function startEditMileage() {
  mileageDraft.value = vehicle.currentMileage
  isEditingMileage.value = true
}

function saveMileage() {
  vehicle.updateMileage(mileageDraft.value)
  isEditingMileage.value = false
}
</script>

<template>
  <div class="dashboard">
    <header class="hero card">
      <div class="hero-info">
        <p class="card-title">내 차량</p>
        <h1>{{ vehicle.carModel }}</h1>
        <p class="insurance">{{ vehicle.insuranceProvider }}</p>
      </div>
      <div class="mileage-box">
        <p class="card-title">현재 누적 주행거리</p>
        <div v-if="!isEditingMileage" class="mileage-display">
          <span class="mileage-value">{{ vehicle.currentMileage.toLocaleString() }}</span>
          <span class="unit">km</span>
          <button class="btn-ghost" @click="startEditMileage">수정</button>
        </div>
        <div v-else class="mileage-edit">
          <input v-model.number="mileageDraft" type="number" min="0" />
          <button class="btn-primary" @click="saveMileage">저장</button>
        </div>
      </div>
    </header>

    <section class="widgets">
      <AccidentFreeWidget />
      <AlertWidget />
      <CostChartWidget class="span-2" />
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-info h1 {
  font-size: 24px;
  margin: 4px 0;
}

.insurance {
  color: var(--color-text-muted);
  font-size: 14px;
}

.mileage-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.mileage-value {
  font-size: 28px;
  font-weight: 700;
}

.unit {
  color: var(--color-text-muted);
}

.mileage-edit {
  display: flex;
  gap: 8px;
}

.mileage-edit input {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  padding: 8px 10px;
  width: 140px;
}

.widgets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.span-2 {
  grid-column: 1 / -1;
}

@media (max-width: 720px) {
  .widgets {
    grid-template-columns: 1fr;
  }
}
</style>
