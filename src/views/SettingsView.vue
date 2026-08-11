<script setup>
import { reactive, ref } from 'vue'
import { useVehicleStore } from '@/stores/useVehicleStore'

const vehicle = useVehicleStore()

const form = reactive({
  carModel: vehicle.carModel,
  currentMileage: vehicle.currentMileage,
  insuranceProvider: vehicle.insuranceProvider,
  lastAccidentDate: vehicle.lastAccidentDate,
  insuranceStart: vehicle.insuranceStart,
  insuranceEnd: vehicle.insuranceEnd,
})

const errorMessage = ref('')

function save() {
  if (
    form.insuranceStart &&
    form.insuranceEnd &&
    new Date(form.insuranceEnd) < new Date(form.insuranceStart)
  ) {
    errorMessage.value = '보험 계약 종료일은 시작일보다 이후여야 합니다.'
    return
  }
  errorMessage.value = ''
  vehicle.updateVehicleInfo({ ...form })
}
</script>

<template>
  <div class="settings-view">
    <h1>차량 및 보험 정보</h1>

    <div class="card form-card">
      <label class="field">
        <span>차량 모델명</span>
        <input v-model="form.carModel" type="text" />
      </label>

      <label class="field">
        <span>현재 누적 주행거리 (km)</span>
        <input v-model.number="form.currentMileage" type="number" min="0" />
      </label>

      <label class="field">
        <span>가입 보험사</span>
        <input v-model="form.insuranceProvider" type="text" />
      </label>

      <label class="field">
        <span>마지막 사고일</span>
        <input v-model="form.lastAccidentDate" type="date" />
      </label>

      <div class="grid-2">
        <label class="field">
          <span>보험 계약 시작일</span>
          <input v-model="form.insuranceStart" type="date" />
        </label>

        <label class="field">
          <span>보험 계약 종료일</span>
          <input v-model="form.insuranceEnd" type="date" />
        </label>
      </div>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <div class="actions">
        <button class="btn-primary" @click="save">저장</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 520px;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.field input {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  padding: 8px 10px;
  font-family: inherit;
  font-size: 14px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.error-text {
  color: var(--color-danger);
  font-size: 13px;
}

@media (max-width: 480px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
