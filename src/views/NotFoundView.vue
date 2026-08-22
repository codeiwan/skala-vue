<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goHome = () => {
  router.push({ name: 'HikingHome' })
}

const goWelcome = () => {
  router.push({ name: 'Welcome' })
}
</script>

<template>
  <div class="not-found-page">
    <main class="not-found-container">
      <section class="not-found-card">
        <div class="mountain-symbol" aria-hidden="true">
          <div class="symbol-sun"></div>
          <div class="symbol-peak peak-one"></div>
          <div class="symbol-peak peak-two"></div>
        </div>

        <div class="not-found-content">
          <p class="eyebrow">LOST ON THE TRAIL</p>
          <strong class="error-code">404</strong>

          <h1>이 길에서는 페이지를 찾지 못했어요.</h1>

          <p>
            주소가 변경되었거나 존재하지 않는 경로일 수 있어요. 산 찾기로 돌아가 다시 시작해 보세요.
          </p>

          <div class="request-path">
            <span>REQUEST PATH</span>
            <code>{{ route.fullPath }}</code>
          </div>

          <div class="actions">
            <el-button type="primary" size="large" @click="goHome"> 산 찾기로 돌아가기 </el-button>

            <el-button size="large" plain @click="goWelcome"> Welcome </el-button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 68px);
  padding: 48px 24px;
  background: var(--color-background);
}

.not-found-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.not-found-card {
  display: grid;
  grid-template-columns: minmax(300px, 0.85fr) minmax(0, 1.15fr);
  min-height: 520px;
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.mountain-symbol {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #e8f0e9 0%, #dce8df 100%);
}

.symbol-sun {
  position: absolute;
  top: 70px;
  right: 72px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: rgba(196, 135, 49, 0.22);
}

.symbol-peak {
  position: absolute;
  transform: rotate(45deg);
  border-radius: 35px 5px 35px 5px;
}

.peak-one {
  right: -60px;
  bottom: -120px;
  width: 340px;
  height: 340px;
  background: #87a08e;
}

.peak-two {
  left: -90px;
  bottom: -150px;
  width: 400px;
  height: 400px;
  background: var(--color-primary-dark);
}

.not-found-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 54px 58px;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.7px;
}

.error-code {
  margin-top: 6px;
  color: var(--color-primary);
  font-size: 65px;
  line-height: 1;
}

.not-found-content h1 {
  max-width: 480px;
  margin: 20px 0 0;
  color: var(--color-primary-deep);
  font-size: 31px;
  line-height: 1.3;
  letter-spacing: -1px;
}

.not-found-content > p {
  max-width: 480px;
  margin: 14px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.request-path {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 27px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--color-surface-soft);
}

.request-path span {
  color: var(--color-text-muted);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.request-path code {
  overflow: hidden;
  color: var(--color-primary-dark);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 26px;
}

.actions .el-button {
  min-height: 44px;
  border-radius: 10px;
  font-weight: 800;
}

@media (max-width: 700px) {
  .not-found-card {
    grid-template-columns: 1fr;
  }
  .mountain-symbol {
    min-height: 230px;
  }
  .not-found-content {
    padding: 38px 26px;
  }
}
</style>
