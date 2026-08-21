<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="simple-page">
    <main class="simple-container">
      <p class="eyebrow">ABOUT WEATHER SIGNAL</p>

      <h1>Weather Signal 소개</h1>

      <p class="lead">
        Weather Signal은 지역별 날씨 정보를 단순히 보여주는 것을 넘어, 날씨 조건을 기반으로 사용자의
        활동 적합도와 추천 행동을 함께 제공하는 Weather Activity Insight Mockup입니다.
      </p>

      <section class="content-card">
        <h2>현재 프로젝트에서 제공하는 기능</h2>

        <ul>
          <li>지역별 날씨 Mock Data 조회</li>
          <li>도시 이름 기반 검색</li>
          <li>활동 적합도 기준 변경</li>
          <li>도시별 Activity Insight 제공</li>
          <li>Vue Router를 이용한 상세 페이지 이동</li>
        </ul>
      </section>

      <button class="home-button" @click="goHome">메인 대시보드로 돌아가기</button>
    </main>
  </div>
</template>

<style scoped>
.simple-page {
  min-height: 100vh;

  padding: 64px 24px;

  background-color: #f4f7fb;

  color: #1f2937;
}

.simple-container {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 10px;

  color: #2563eb;

  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

h1 {
  margin: 0;

  font-size: 42px;
}

.lead {
  margin-top: 18px;

  color: #6b7280;

  font-size: 18px;
  line-height: 1.8;
}

.content-card {
  padding: 28px;
  margin-top: 32px;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.content-card h2 {
  margin-top: 0;
}

.content-card li {
  margin: 10px 0;

  line-height: 1.5;
}

.home-button {
  margin-top: 24px;

  padding: 12px 18px;

  border: none;
  border-radius: 8px;

  background-color: #2563eb;
  color: #ffffff;

  font-weight: 700;

  cursor: pointer;
}
</style>
