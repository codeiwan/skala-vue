<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goHome = () => {
  router.push({ name: 'HikingHome' })
}
</script>

<template>
  <div class="not-found-page">
    <el-card shadow="never" class="not-found-card">
      <el-result
        icon="warning"
        title="404 · 페이지를 찾을 수 없습니다."
        sub-title="요청한 주소와 일치하는 Hiking Signal 페이지가 없습니다."
      >
        <template #extra>
          <div class="request-path">
            <span>요청 경로</span>
            <code>{{ route.fullPath }}</code>
          </div>

          <el-button type="primary" @click="goHome"> 산 찾기로 돌아가기 </el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  padding: 32px 24px;
  background: #f4f7fb;
}

.not-found-card {
  width: 100%;
  max-width: 680px;
  border-radius: 18px;
}
.request-path {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #64748b;
}
.request-path code {
  padding: 5px 9px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #dc2626;
}

@media (max-width: 520px) {
  .request-path {
    flex-direction: column;
  }
}
</style>
