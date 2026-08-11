<script setup>
import { computed, ref } from 'vue'
import { useMaintenanceStore, MAINTENANCE_CATEGORIES } from '@/stores/useMaintenanceStore'
import TimelineItem from '@/components/maintenance/TimelineItem.vue'
import MaintenanceForm from '@/components/maintenance/MaintenanceForm.vue'

const maintenance = useMaintenanceStore()

const activeCategory = ref('전체')
const isFormOpen = ref(false)

const filteredRecords = computed(() => {
  if (activeCategory.value === '전체') return maintenance.sortedByDateDesc
  return maintenance.sortedByDateDesc.filter((r) => r.category === activeCategory.value)
})

function handleSave(record) {
  maintenance.addRecord(record)
  isFormOpen.value = false
}
</script>

<template>
  <div class="maintenance-view">
    <header class="header">
      <h1>정비 이력</h1>
      <button class="btn-primary" @click="isFormOpen = true">+ 기록 추가</button>
    </header>

    <div class="filters">
      <button
        class="filter-chip"
        :class="{ 'filter-chip--active': activeCategory === '전체' }"
        @click="activeCategory = '전체'"
      >
        전체
      </button>
      <button
        v-for="c in MAINTENANCE_CATEGORIES"
        :key="c"
        class="filter-chip"
        :class="{ 'filter-chip--active': activeCategory === c }"
        @click="activeCategory = c"
      >
        {{ c }}
      </button>
    </div>

    <ul v-if="filteredRecords.length" class="timeline">
      <TimelineItem
        v-for="record in filteredRecords"
        :key="record.id"
        :record="record"
        @delete="maintenance.removeRecord"
      />
    </ul>
    <div v-else class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.7 6.3a4 4 0 0 0-5.4 4.6L3 17.2V21h3.8l6.3-6.3a4 4 0 0 0 4.6-5.4l-2.8 2.8-2-2 2.8-2.8Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p>해당 항목의 정비 기록이 없습니다.</p>
    </div>

    <MaintenanceForm v-if="isFormOpen" @save="handleSave" @close="isFormOpen = false" />
  </div>
</template>

<style scoped>
.maintenance-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
}

.filter-chip--active {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
}

.empty-icon {
  width: 40px;
  height: 40px;
  color: var(--color-border);
}
</style>
