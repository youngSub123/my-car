<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useMaintenanceStore } from '@/stores/useMaintenanceStore'

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

const maintenance = useMaintenanceStore()

const chartData = computed(() => ({
  labels: maintenance.monthlyCostSummary.labels,
  datasets: [
    {
      label: '월별 유지비용',
      backgroundColor: '#18e0a6',
      borderRadius: 6,
      data: maintenance.monthlyCostSummary.data,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#8b94a3' },
    },
    y: {
      grid: { color: '#2a2f3a' },
      ticks: { color: '#8b94a3' },
    },
  },
}

const totalCost = computed(() =>
  maintenance.monthlyCostSummary.data.reduce((sum, v) => sum + v, 0),
)
</script>

<template>
  <div class="card cost-chart">
    <div class="header">
      <p class="card-title">비용 통계</p>
      <span class="total">총 {{ totalCost.toLocaleString() }}원</span>
    </div>
    <div class="chart-area">
      <Bar
        v-if="chartData.labels.length"
        :data="chartData"
        :options="chartOptions"
      />
      <p v-else class="empty">정비 기록을 추가하면 비용 추이가 표시됩니다.</p>
    </div>
  </div>
</template>

<style scoped>
.cost-chart {
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.total {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
}

.chart-area {
  flex: 1;
  min-height: 180px;
  margin-top: 12px;
}

.empty {
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
