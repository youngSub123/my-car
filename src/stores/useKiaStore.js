import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

const KIA_AUTHORIZE_URL = 'https://prd.kr-ccapi.kia.com/api/v1/user/oauth2/authorize'

const DTE_UNIT_LABEL = { 0: 'ft', 1: 'km', 2: 'm', 3: 'mi' }

export const useKiaStore = defineStore('kia', {
  state: () => ({
    connected: false,
    carId: null,
    distanceValue: null,
    distanceUnit: null,
    updatedAt: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    distanceLabel(state) {
      if (state.distanceValue == null) return null
      const unit = DTE_UNIT_LABEL[state.distanceUnit] ?? ''
      return `${state.distanceValue.toLocaleString()} ${unit}`
    },

    friendlyError(state) {
      if (!state.error) return null
      if (/"errCode"\s*:\s*"4045"|No Data/i.test(state.error)) {
        return '아직 차량 데이터가 없어요. 최근 주행 기록이 없으면 데이터가 제공되지 않을 수 있어요.'
      }
      return '차량 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
    },
  },

  actions: {
    startConnect() {
      const clientId = import.meta.env.VITE_KIA_CLIENT_ID
      const redirectUri = import.meta.env.VITE_KIA_REDIRECT_URI
      const state = crypto.randomUUID()
      const url = new URL(KIA_AUTHORIZE_URL)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('client_id', clientId)
      url.searchParams.set('redirect_uri', redirectUri)
      url.searchParams.set('state', state)
      window.location.href = url.toString()
    },

    async exchangeCode(code, state) {
      const { data, error } = await supabase.functions.invoke('kia-callback', {
        body: { action: 'exchange', code, state },
      })
      if (error) throw error
      if (data.error) throw new Error(data.error)
      return data.accessToken
    },

    async completeConsent(userId, state) {
      const { data, error } = await supabase.functions.invoke('kia-callback', {
        body: { action: 'complete', userId, state },
      })
      if (error) throw error
      if (data.error) throw new Error(data.error)
      return data
    },

    async fetchVehicleData() {
      this.isLoading = true
      this.error = null
      const { data, error } = await supabase.functions.invoke('kia-vehicle-data')

      if (error) {
        this.error = error.message
        this.isLoading = false
        return
      }

      this.connected = !!data.connected
      if (data.connected && data.distanceToEmpty) {
        this.carId = data.carId
        this.distanceValue = data.distanceToEmpty.value
        this.distanceUnit = data.distanceToEmpty.unit
        this.updatedAt = data.distanceToEmpty.timestamp
      }
      if (data.error) {
        this.error = data.error
      }
      this.isLoading = false
    },
  },
})
