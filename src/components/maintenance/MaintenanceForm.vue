<script setup>
import { reactive } from 'vue'
import { MAINTENANCE_CATEGORIES } from '@/stores/useMaintenanceStore'
import { useVehicleStore } from '@/stores/useVehicleStore'

const emit = defineEmits(['save', 'close'])

const vehicle = useVehicleStore()

const form = reactive({
  category: MAINTENANCE_CATEGORIES[0],
  serviceDate: new Date().toISOString().slice(0, 10),
  cost: null,
  mileageAtService: vehicle.currentMileage || null,
  nextDueMileage: null,
  memo: '',
})

function submit() {
  if (!form.cost || !form.serviceDate) return
  emit('save', { ...form })
}
</script>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal card">
      <h2>정비 기록 추가</h2>

      <label class="field">
        <span>정비 항목</span>
        <select v-model="form.category">
          <option v-for="c in MAINTENANCE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="field">
        <span>정비 완료일</span>
        <input v-model="form.serviceDate" type="date" />
      </label>

      <label class="field">
        <span>비용 (원)</span>
        <input v-model.number="form.cost" type="number" min="0" placeholder="예: 89000" />
      </label>

      <label class="field">
        <span>정비 당시 주행거리 (km, 선택)</span>
        <input v-model.number="form.mileageAtService" type="number" min="0" placeholder="예: 82000" />
      </label>

      <label class="field">
        <span>다음 교체 권장 주행거리 (km, 선택)</span>
        <input v-model.number="form.nextDueMileage" type="number" min="0" placeholder="예: 87000" />
      </label>

      <label class="field">
        <span>메모 (선택)</span>
        <textarea v-model="form.memo" rows="2" placeholder="예: 5W30 합성유 교체" />
      </label>

      <div class="actions">
        <button class="btn-ghost" @click="$emit('close')">취소</button>
        <button class="btn-primary" @click="submit">저장</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.field input,
.field select,
.field textarea {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  padding: 8px 10px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}
</style>
