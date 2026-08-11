<script setup></script>

<template>
  <div class="not-found">
    <p class="code">404</p>
    <h1>페이지를 찾을 수 없습니다</h1>
    <p class="desc">요청하신 주소가 존재하지 않거나 이동되었습니다.</p>
    <RouterLink to="/" class="btn-primary">대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
}

.code {
  font-size: 56px;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 4px;
}

.desc {
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.btn-primary {
  text-decoration: none;
  display: inline-block;
}
</style>
