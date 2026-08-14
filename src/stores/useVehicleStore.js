import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

function mapVehicle(row) {
  return {
    id: row.id,
    carModel: row.car_model,
    currentMileage: row.current_mileage,
    insuranceProvider: row.insurance_provider,
    lastAccidentDate: row.last_accident_date,
    insuranceStart: row.insurance_start,
    insuranceEnd: row.insurance_end,
    inspectionExpiry: row.inspection_expiry,
  }
}

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    id: null,
    carModel: '',
    currentMileage: 0,
    insuranceProvider: '',
    lastAccidentDate: null,
    insuranceStart: null,
    insuranceEnd: null,
    inspectionExpiry: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    daysWithoutAccident(state) {
      if (!state.lastAccidentDate) return 0
      const diffMs = Date.now() - new Date(state.lastAccidentDate).getTime()
      return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    },

    daysUntilInsuranceExpiry(state) {
      if (!state.insuranceEnd) return null
      const diffMs = new Date(state.insuranceEnd).getTime() - Date.now()
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    },

    daysUntilInspectionExpiry(state) {
      if (!state.inspectionExpiry) return null
      const diffMs = new Date(state.inspectionExpiry).getTime() - Date.now()
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    },
  },

  actions: {
    async fetchVehicle() {
      this.isLoading = true
      this.error = null
      const { data, error } = await supabase.from('vehicles').select('*').limit(1).maybeSingle()

      if (error) {
        this.error = error.message
      } else if (data) {
        Object.assign(this, mapVehicle(data))
      }
      this.isLoading = false
    },

    async updateMileage(mileage) {
      this.currentMileage = Number(mileage)
      await this.persist()
    },

    async updateVehicleInfo(payload) {
      Object.assign(this, payload)
      await this.persist()
    },

    async persist() {
      if (!this.id) return
      const { error } = await supabase
        .from('vehicles')
        .update({
          car_model: this.carModel,
          current_mileage: this.currentMileage,
          insurance_provider: this.insuranceProvider,
          last_accident_date: this.lastAccidentDate,
          insurance_start: this.insuranceStart,
          insurance_end: this.insuranceEnd,
          inspection_expiry: this.inspectionExpiry,
        })
        .eq('id', this.id)

      if (error) this.error = error.message
    },
  },
})
