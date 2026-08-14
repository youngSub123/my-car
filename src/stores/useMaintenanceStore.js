import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import { useVehicleStore } from './useVehicleStore'

const DUE_SOON_THRESHOLD_KM = 500
const INSURANCE_DUE_SOON_DAYS = 30
const INSPECTION_DUE_SOON_DAYS = 30

export const MAINTENANCE_CATEGORIES = ['엔진오일', '타이어', '브레이크', '배터리', '냉각수', '기타']

function mapRecord(row) {
  return {
    id: row.id,
    category: row.category,
    serviceDate: row.service_date,
    cost: row.cost,
    mileageAtService: row.mileage_at_service,
    nextDueMileage: row.next_due_mileage,
    memo: row.memo,
  }
}

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    records: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    sortedByDateDesc(state) {
      return [...state.records].sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate))
    },

    mileageAlerts(state) {
      const vehicle = useVehicleStore()
      return state.records
        .filter((r) => r.nextDueMileage != null)
        .map((r) => ({
          ...r,
          remainingKm: r.nextDueMileage - vehicle.currentMileage,
        }))
        .filter((r) => r.remainingKm <= DUE_SOON_THRESHOLD_KM)
        .sort((a, b) => a.remainingKm - b.remainingKm)
    },

    insuranceAlert() {
      const vehicle = useVehicleStore()
      const days = vehicle.daysUntilInsuranceExpiry
      if (days == null || days > INSURANCE_DUE_SOON_DAYS) return null
      return { days }
    },

    inspectionAlert() {
      const vehicle = useVehicleStore()
      const days = vehicle.daysUntilInspectionExpiry
      if (days == null || days > INSPECTION_DUE_SOON_DAYS) return null
      return { days }
    },

    monthlyCostSummary(state) {
      const buckets = new Map()
      for (const record of state.records) {
        const date = new Date(record.serviceDate)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        buckets.set(key, (buckets.get(key) ?? 0) + Number(record.cost || 0))
      }
      const labels = [...buckets.keys()].sort()
      return {
        labels,
        data: labels.map((key) => buckets.get(key)),
      }
    },
  },

  actions: {
    async fetchRecords() {
      const vehicle = useVehicleStore()
      if (!vehicle.id) return

      this.isLoading = true
      this.error = null
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('vehicle_id', vehicle.id)
        .order('service_date', { ascending: false })

      if (error) {
        this.error = error.message
      } else {
        this.records = data.map(mapRecord)
      }
      this.isLoading = false
    },

    async addRecord(record) {
      const vehicle = useVehicleStore()
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert({
          vehicle_id: vehicle.id,
          category: record.category,
          service_date: record.serviceDate,
          cost: record.cost,
          mileage_at_service: record.mileageAtService,
          next_due_mileage: record.nextDueMileage,
          memo: record.memo,
        })
        .select()
        .single()

      if (error) {
        this.error = error.message
        return
      }
      this.records.push(mapRecord(data))
    },

    async removeRecord(id) {
      const { error } = await supabase.from('maintenance_records').delete().eq('id', id)
      if (error) {
        this.error = error.message
        return
      }
      this.records = this.records.filter((r) => r.id !== id)
    },
  },
})
