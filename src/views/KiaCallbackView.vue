<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKiaStore } from '@/stores/useKiaStore'

const route = useRoute()
const router = useRouter()
const kia = useKiaStore()

const status = ref('처리 중입니다...')
const errorMessage = ref('')

const consentFormAction = 'https://dev.kr-ccapi.kia.com/api/v1/car-service/terms/agreement'
const formToken = ref('')
const formState = ref('')
const formRef = ref(null)

onMounted(async () => {
  const { code, state, userId, errCode, errMsg } = route.query

  if (errCode) {
    router.replace(`/settings?kia_error=${encodeURIComponent(errMsg || errCode)}`)
    return
  }

  try {
    if (code) {
      status.value = '기아 서버와 인증하는 중입니다...'
      const accessToken = await kia.exchangeCode(code, state)
      formToken.value = accessToken
      formState.value = state ?? ''
      status.value = '개인정보 제공 동의 화면으로 이동합니다...'
      await nextTick()
      formRef.value.submit()
      return
    }

    if (userId) {
      status.value = '차량 정보를 불러오는 중입니다...'
      await kia.completeConsent(userId, state)
      router.replace('/settings?kia_connected=1')
      return
    }

    router.replace('/settings')
  } catch (e) {
    errorMessage.value = e.message
  }
})
</script>

<template>
  <div class="callback-view">
    <p v-if="!errorMessage" class="status-text">{{ status }}</p>
    <p v-else class="error-text">연동 중 오류가 발생했습니다: {{ errorMessage }}</p>

    <form ref="formRef" method="POST" :action="consentFormAction" style="display: none">
      <input type="hidden" name="token" :value="formToken" />
      <input type="hidden" name="state" :value="formState" />
    </form>
  </div>
</template>

<style scoped>
.callback-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
}

.status-text {
  color: var(--color-text-muted);
}

.error-text {
  color: var(--color-danger);
}
</style>
