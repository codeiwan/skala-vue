<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <main class="not-found-card">
      <p class="error-code">404</p>

      <h1>페이지를 찾을 수 없습니다.</h1>

      <p>요청한 주소와 일치하는 Weather Signal 페이지가 없습니다.</p>

      <button @click="goHome">메인 대시보드로 돌아가기</button>
    </main>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;

  align-items: center;
  justify-content: center;

  min-height: calc(100vh - 80px);

  padding: 24px;

  background-color: #f4f7fb;
}

.not-found-card {
  width: 100%;
  max-width: 600px;

  padding: 48px;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  text-align: center;
}

.error-code {
  margin: 0;

  color: #2563eb;

  font-size: 72px;
  font-weight: 800;
}

h1 {
  margin: 8px 0;
}

.not-found-card p:not(.error-code) {
  color: #6b7280;
}

button {
  margin-top: 20px;

  padding: 12px 18px;

  border: none;
  border-radius: 8px;

  background-color: #2563eb;
  color: #ffffff;

  font-weight: 700;

  cursor: pointer;
}
</style>
