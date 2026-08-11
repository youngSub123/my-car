<script setup>
defineProps({
  record: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])
</script>

<template>
  <li class="timeline-item">
    <div class="marker" />
    <div class="content card">
      <div class="row">
        <span class="category">{{ record.category }}</span>
        <span class="date">{{ record.serviceDate }}</span>
      </div>
      <p v-if="record.memo" class="memo">{{ record.memo }}</p>
      <div class="row row-bottom">
        <span class="cost">{{ Number(record.cost).toLocaleString() }}원</span>
        <span v-if="record.mileageAtService" class="next-due">
          {{ Number(record.mileageAtService).toLocaleString() }}km에 정비
        </span>
        <span v-if="record.nextDueMileage" class="next-due">
          다음 교체: {{ Number(record.nextDueMileage).toLocaleString() }}km
        </span>
        <button class="delete-btn" @click="$emit('delete', record.id)">삭제</button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.timeline-item {
  display: flex;
  gap: 14px;
}

.marker {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  margin-top: 22px;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category {
  font-weight: 600;
}

.date {
  color: var(--color-text-muted);
  font-size: 13px;
}

.memo {
  margin-top: 6px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.row-bottom {
  margin-top: 10px;
  gap: 12px;
}

.cost {
  font-weight: 600;
  color: var(--color-accent);
}

.next-due {
  font-size: 13px;
  color: var(--color-text-muted);
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 13px;
}
</style>
