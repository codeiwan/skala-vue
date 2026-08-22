<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'HikingHome' })
}
</script>

<template>
  <div class="about-page">
    <main class="about-container">
      <header class="about-header">
        <p class="eyebrow">ABOUT HIKING SIGNAL</p>
        <h1>산 정보를 찾고, 오늘의 산행 환경까지 확인합니다.</h1>
        <p class="lead">
          Hiking Signal은 산림청 공공데이터를 중심으로 산의 기본 정보와 산행 코스를 제공하고,
          OpenWeatherMap의 기상·대기질 데이터를 결합해 현재 산행 환경을 함께 확인할 수 있는 Vue 기반
          웹 애플리케이션입니다.
        </p>
      </header>

      <section class="feature-grid">
        <el-card shadow="never" class="feature-card">
          <span class="feature-label">PUBLIC DATA</span>
          <h2>산 정보 검색</h2>
          <p>산림청 산 정보 조회_GW API를 이용해 산명, 높이, 소재지와 상세정보를 조회합니다.</p>
        </el-card>

        <el-card shadow="never" class="feature-card">
          <span class="feature-label">WEATHER</span>
          <h2>산행 기상 확인</h2>
          <p>산 소재지를 대표 기상 지역과 연결해 현재 기온, 습도, 풍속과 날씨를 확인합니다.</p>
        </el-card>

        <el-card shadow="never" class="feature-card">
          <span class="feature-label">AIR QUALITY</span>
          <h2>대기질 확인</h2>
          <p>대표 지역 좌표를 이용해 AQI와 PM2.5, PM10 등의 대기질 정보를 함께 제공합니다.</p>
        </el-card>

        <el-card shadow="never" class="feature-card">
          <span class="feature-label">HIKING CONDITION</span>
          <h2>산행 환경 점수</h2>
          <p>기온, 습도, 풍속, 기상 상태, 가시거리와 대기질을 조합한 참고용 점수를 제공합니다.</p>
        </el-card>
      </section>

      <el-alert
        title="기상 및 산행 환경 정보는 대표 지역 데이터를 활용한 참고 정보이며 실제 현지 통제나 정밀 산악예보를 대신하지 않습니다."
        type="info"
        :closable="false"
        show-icon
        class="notice"
      />

      <div class="actions">
        <el-button type="primary" size="large" @click="goHome"> 산 찾기로 돌아가기 </el-button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: 52px 24px 72px;
  background: #f4f7fb;
  color: #1f2937;
}
.about-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.about-header {
  max-width: 850px;
  margin-bottom: 30px;
}
.eyebrow,
.feature-label {
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.eyebrow {
  margin: 0 0 8px;
}
.about-header h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.25;
  letter-spacing: -0.8px;
}
.lead {
  margin: 16px 0 0;
  color: #64748b;
  font-size: 17px;
  line-height: 1.8;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.feature-card {
  border-radius: 16px;
}
.feature-card h2 {
  margin: 8px 0 10px;
  font-size: 21px;
}
.feature-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}
.notice {
  margin-top: 22px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}

@media (max-width: 650px) {
  .about-page {
    padding: 34px 16px 52px;
  }
  .about-header h1 {
    font-size: 30px;
  }
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
