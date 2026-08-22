<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'HikingHome' })
}

const goGuide = () => {
  router.push({ name: 'HikingGuide' })
}
</script>

<template>
  <div class="about-page">
    <main class="about-container">
      <section class="about-hero">
        <div>
          <p class="eyebrow">ABOUT HIKING SIGNAL</p>

          <h1>
            산을 찾는 것에서 끝나지 않고,<br />
            오늘의 환경까지 함께 살펴봐요.
          </h1>

          <p class="hero-description">
            산림청 공공데이터에 기상과 대기질 정보를 더해 산행 전에 필요한 정보를 한곳에서 확인할 수
            있도록 구성했어요.
          </p>

          <div class="about-actions">
            <el-button type="primary" size="large" @click="goHome">
              산행 정보 확인하기 →
            </el-button>

            <el-button size="large" plain @click="goGuide"> 산행 가이드 보기 </el-button>
          </div>
        </div>

        <div class="about-symbol" aria-hidden="true">
          <span>HIKING</span>
          <strong>SIGNAL</strong>
          <small>Vue Project</small>
        </div>
      </section>

      <section class="feature-section">
        <div class="section-heading">
          <p class="eyebrow">SERVICE FLOW</p>
          <h2>서로 다른 데이터를 하나의 산행 흐름으로 연결했어요.</h2>
        </div>

        <div class="feature-grid">
          <article class="feature-card">
            <span>01</span>

            <p class="feature-label">PUBLIC DATA</p>
            <h3>산림청 산 정보</h3>

            <p>산 이름을 기준으로 높이와 소재지, 추천 코스, 교통 정보와 산 소개를 조회해요.</p>
          </article>

          <article class="feature-card">
            <span>02</span>

            <p class="feature-label">REGION MAPPING</p>
            <h3>대표 기상 지역 연결</h3>

            <p>
              산 정보에 정확한 좌표가 없어 소재지를 분석하고 기존 기상 지역 가운데 대표 지역을
              선택해 연결했어요.
            </p>
          </article>

          <article class="feature-card">
            <span>03</span>

            <p class="feature-label">WEATHER & AIR</p>
            <h3>기상과 대기질</h3>

            <p>대표 지역의 현재 날씨를 조회하고 해당 좌표를 이용해 대기질 정보도 함께 확인해요.</p>
          </article>

          <article class="feature-card">
            <span>04</span>

            <p class="feature-label">HIKING CONDITION</p>
            <h3>산행 환경 점수</h3>

            <p>기온, 습도, 풍속, 기상 상태, 가시거리와 AQI를 조합해 참고용 환경 점수를 보여줘요.</p>
          </article>
        </div>
      </section>

      <section class="technology-section">
        <div class="technology-heading">
          <p class="eyebrow">BUILT WITH VUE</p>
          <h2>
            수업에서 배운 기능을<br />
            실제 서비스 흐름에 적용했어요.
          </h2>

          <p>
            기능을 단순히 각각 구현하는 데 그치지 않고, 산을 검색하는 흐름 안에서 서로 연결해
            사용하는 것을 목표로 했어요.
          </p>
        </div>

        <div class="technology-list">
          <div>
            <strong>Vue Router</strong>
            <span>산 검색, 상세, 가이드, 날씨와 학습 화면 이동</span>
          </div>

          <div>
            <strong>Pinia</strong>
            <span>산·날씨 상태와 온도 단위, 개인 산행 추천 기준 관리</span>
          </div>

          <div>
            <strong>Axios</strong>
            <span>산림청과 OpenWeatherMap 외부 API 요청</span>
          </div>

          <div>
            <strong>Element Plus</strong>
            <span>Card, Input, Slider, Progress 등의 UI 구성</span>
          </div>

          <div>
            <strong>DOMParser</strong>
            <span>산림청 XML 응답을 애플리케이션에서 사용할 객체로 변환</span>
          </div>

          <div>
            <strong>Vercel</strong>
            <span>SPA Routing과 환경변수를 설정해 웹으로 배포</span>
          </div>
        </div>
      </section>

      <section class="notice-section">
        <div>
          <p class="eyebrow">PLEASE NOTE</p>
          <h2>산행 전 참고 정보로 활용해 주세요.</h2>

          <p>
            Hiking Signal의 날씨와 대기질은 산 정상의 정밀 관측값이 아니라 산 소재지와 연결한 대표
            지역 데이터를 사용해요. 실제 산행 전에는 현장 통제와 공식 산악 예보도 함께 확인하는 것이
            좋아요.
          </p>
        </div>

        <el-button type="primary" size="large" @click="goHome"> 산 찾아보기 → </el-button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: 46px 24px 80px;
  background: var(--color-background);
  color: var(--color-text);
}
.about-container {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.7px;
}

.about-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 44px;
  padding: 52px 50px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f8faf6 0%, #e6eee7 100%);
}

.about-hero h1 {
  max-width: 900px;
  margin: 0;
  color: var(--color-primary-deep);
  font-size: clamp(40px, 5vw, 56px);
  line-height: 1.18;
  letter-spacing: -2px;
}

.hero-description {
  max-width: 820px;
  margin: 20px 0 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.85;
}

.about-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 28px;
}
.about-actions .el-button {
  min-height: 46px;
  border-radius: 11px;
  font-weight: 800;
}

.about-symbol {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 150px;
}

.about-symbol span,
.about-symbol small {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.3px;
}
.about-symbol strong {
  margin: 3px 0;
  color: var(--color-primary);
  font-size: 35px;
  line-height: 1;
}

.feature-section {
  padding: 72px 0 54px;
}
.section-heading {
  max-width: 760px;
  margin-bottom: 24px;
}

.section-heading h2,
.technology-section h2,
.notice-section h2 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 29px;
  line-height: 1.4;
  letter-spacing: -0.9px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.feature-card {
  min-height: 210px;
  padding: 28px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-medium);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.feature-card > span {
  color: #afc1b3;
  font-size: 10px;
  font-weight: 900;
}
.feature-label {
  margin: 27px 0 5px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.3px;
}
.feature-card h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 20px;
}
.feature-card p:last-child {
  margin: 11px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.75;
}

.technology-section {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
  gap: 50px;
  margin-bottom: 28px;
  padding: 42px;
  border-radius: var(--radius-large);
  background: var(--color-primary-deep);
}

.technology-section h2 {
  color: #ffffff;
}
.technology-section .eyebrow {
  color: #9fbeaa;
}

.technology-heading > p:last-child {
  margin: 13px 0 0;
  color: rgba(255, 255, 255, 0.61);
  font-size: 12px;
  line-height: 1.75;
}

.technology-list {
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.technology-list div {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.technology-list strong {
  color: #ffffff;
  font-size: 13px;
}
.technology-list span {
  color: rgba(255, 255, 255, 0.63);
  font-size: 12px;
  line-height: 1.6;
}

.notice-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 38px 42px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: var(--color-surface);
}

.notice-section > div {
  max-width: 760px;
}

.notice-section > div > p:last-child {
  margin: 11px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.75;
}

.notice-section .el-button {
  flex-shrink: 0;
  min-height: 46px;
  border-radius: 11px;
  font-weight: 800;
}

@media (max-width: 800px) {
  .about-hero {
    align-items: flex-start;
    flex-direction: column;
  }
  .about-symbol {
    align-items: flex-start;
  }
  .technology-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .about-page {
    padding: 30px 16px 58px;
  }
  .about-hero {
    padding: 36px 25px;
  }
  .about-hero h1 {
    font-size: 37px;
  }
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .technology-section {
    gap: 30px;
    padding: 32px 25px;
  }
  .technology-list div {
    grid-template-columns: 1fr;
    gap: 5px;
  }
  .notice-section {
    align-items: flex-start;
    flex-direction: column;
    padding: 32px 25px;
  }
  .notice-section .el-button {
    width: 100%;
  }
}
</style>
