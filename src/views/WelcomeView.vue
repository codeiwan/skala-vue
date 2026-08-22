<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHiking = () => {
  router.push({ name: 'HikingHome' })
}

const goAbout = () => {
  router.push({ name: 'About' })
}
</script>

<template>
  <div class="welcome-page">
    <main class="welcome-container">
      <section class="welcome-hero">
        <div class="hero-content">
          <p class="eyebrow">MOUNTAIN & WEATHER GUIDE</p>

          <h1>
            오늘의 산행,<br />
            가볍게 확인하고 떠나볼까요?
          </h1>

          <p class="hero-description">
            가고 싶은 산의 정보와 주변 날씨, 대기질을 한곳에서 확인하고 오늘의 산행 환경을 미리
            살펴보세요.
          </p>

          <div class="hero-actions">
            <el-button type="primary" size="large" @click="goHiking">
              산행 정보 확인하기 →
            </el-button>

            <el-button size="large" plain @click="goAbout"> 서비스 둘러보기 </el-button>
          </div>

          <div class="hero-meta">
            <div>
              <strong>PUBLIC DATA</strong>
              <span>믿을 수 있는 산 정보</span>
            </div>

            <div>
              <strong>WEATHER</strong>
              <span>날씨와 대기질 확인</span>
            </div>

            <div>
              <strong>CONDITION</strong>
              <span>오늘의 산행 환경 점수</span>
            </div>
          </div>
        </div>

        <div class="landscape" aria-hidden="true">
          <svg
            class="mountain-scene"
            viewBox="0 0 720 460"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
          >
            <circle cx="590" cy="82" r="38" fill="rgba(196, 135, 49, 0.24)" />
            <circle cx="590" cy="82" r="56" fill="rgba(196, 135, 49, 0.06)" />

            <g opacity="0.8">
              <circle cx="622" cy="138" r="18" fill="rgba(255,255,255,0.75)" />
              <circle cx="648" cy="142" r="14" fill="rgba(255,255,255,0.75)" />
              <circle cx="604" cy="146" r="12" fill="rgba(255,255,255,0.75)" />
              <rect x="604" y="142" width="58" height="14" rx="7" fill="rgba(255,255,255,0.75)" />
            </g>

            <g opacity="0.55">
              <circle cx="178" cy="126" r="14" fill="rgba(255,255,255,0.52)" />
              <circle cx="196" cy="130" r="11" fill="rgba(255,255,255,0.52)" />
              <circle cx="162" cy="133" r="9" fill="rgba(255,255,255,0.52)" />
              <rect x="162" y="129" width="42" height="12" rx="6" fill="rgba(255,255,255,0.52)" />
            </g>

            <!-- 뒤 왼쪽 산 -->
            <path d="M92 410 L260 175 Q274 155 288 175 L456 410 Z" fill="#9bb2a1" />

            <!-- 뒤 오른쪽 산 -->
            <path d="M430 410 L560 205 Q575 184 590 205 L720 410 Z" fill="#8ca395" />

            <!-- 메인 산 -->
            <path d="M220 410 L430 132 Q450 106 470 132 L680 410 Z" fill="#215940" />

            <!-- 하단 전경 -->
            <rect x="0" y="410" width="720" height="50" fill="rgba(33, 89, 64, 0.06)" />
          </svg>
        </div>
      </section>

      <section class="service-intro">
        <div class="section-heading">
          <p class="eyebrow">WHAT YOU CAN CHECK</p>
          <h2>떠나기 전 필요한 정보를 한곳에서 확인해 보세요.</h2>
        </div>

        <div class="service-grid">
          <article class="service-card">
            <span class="service-number">01</span>

            <div>
              <p class="service-label">MOUNTAIN</p>
              <h3>산 정보 검색</h3>
              <p>
                가고 싶은 산을 검색하면 높이와 위치부터 추천 코스, 교통 정보까지 필요한 산행 정보를
                확인할 수 있어요.
              </p>
            </div>
          </article>

          <article class="service-card">
            <span class="service-number">02</span>

            <div>
              <p class="service-label">ENVIRONMENT</p>
              <h3>기상과 대기질 확인</h3>
              <p>
                산의 소재지를 기준으로 주변 날씨와 대기질을 연결해, 지금 산행하기 어떤 환경인지
                살펴볼 수 있어요.
              </p>
            </div>
          </article>

          <article class="service-card">
            <span class="service-number">03</span>

            <div>
              <p class="service-label">HIKING CONDITION</p>
              <h3>산행 환경 판단</h3>
              <p>
                기온, 습도, 바람, 날씨, 가시거리와 대기질을 함께 살펴보고 오늘의 Hiking Condition
                점수를 확인해 보세요.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="start-section">
        <div>
          <p class="eyebrow">READY TO START?</p>
          <h2>오늘은 어느 산으로 떠나볼까요?</h2>

          <p>
            산의 기본 정보부터 현재 환경과 Hiking Condition까지, 산행 전에 궁금한 정보를 한눈에
            확인해 보세요.
          </p>
        </div>

        <el-button type="primary" size="large" @click="goHiking"> 산행 정보 확인하기 → </el-button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.welcome-page {
  min-height: 100vh;
  padding: 34px 24px 80px;
  background: var(--color-background);
  color: var(--color-text);
}

.welcome-container {
  width: 100%;
  max-width: var(--content-width-wide);
  margin: 0 auto;
}

.welcome-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(460px, 0.9fr);
  min-height: 650px;
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  border-radius: 30px;
  background: linear-gradient(135deg, #f8faf6 0%, #e8f0e9 52%, #dce9df 100%);
  box-shadow: var(--shadow-card);
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 74px 36px 70px 70px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.hero-content h1 {
  max-width: 720px;
  margin: 0;
  color: var(--color-primary-deep);
  font-size: clamp(48px, 5.6vw, 72px);
  line-height: 1.08;
  letter-spacing: -3px;
}

.hero-description {
  max-width: 620px;
  margin: 24px 0 0;
  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 1.85;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 32px;
}

.hero-actions .el-button {
  min-height: 48px;
  padding: 0 22px;
  border-radius: 12px;
  font-weight: 800;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 54px;
}

.hero-meta div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.hero-meta strong {
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.hero-meta span {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
}

/* Welcome illustration */

.landscape {
  position: relative;
  min-height: 650px;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: 92px;
  right: 100px;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(196, 135, 49, 0.24);
  box-shadow: 0 0 0 18px rgba(196, 135, 49, 0.06);
}

.cloud {
  position: absolute;
  z-index: 2;
  height: 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
}

.cloud::before,
.cloud::after {
  position: absolute;
  bottom: 0;
  content: '';
  border-radius: 50%;
  background: inherit;
}

.cloud::before {
  left: 16px;
  width: 35px;
  height: 35px;
}

.cloud::after {
  right: 13px;
  width: 28px;
  height: 28px;
}

.cloud-small {
  top: 165px;
  left: 70px;
  width: 82px;
  opacity: 0.6;
}

.cloud-large {
  top: 185px;
  right: 38px;
  width: 105px;
}

.mountain {
  position: absolute;
  bottom: 0;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}

.mountain-left {
  left: -42px;
  width: 330px;
  height: 300px;
  background: #9bb2a1;
}

.mountain-right {
  right: -50px;
  width: 360px;
  height: 340px;
  background: #86a08f;
}

.mountain-main {
  right: 90px;
  z-index: 1;
  width: 500px;
  height: 415px;
  background: var(--color-primary-dark);
}

.mountain-scene {
  width: 100%;
  height: 100%;
  display: block;
}

.foreground {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  height: 68px;
  background: linear-gradient(180deg, rgba(23, 58, 45, 0), rgba(23, 58, 45, 0.08));
}

/* Service */

.service-intro {
  padding: 92px 32px 72px;
}

.section-heading {
  max-width: 760px;
  margin-bottom: 30px;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 34px;
  line-height: 1.35;
  letter-spacing: -1.2px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.service-card {
  display: flex;
  gap: 20px;
  min-height: 215px;
  padding: 28px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-medium);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.service-number {
  color: #b0c2b5;
  font-size: 12px;
  font-weight: 900;
}

.service-label {
  margin: 0 0 7px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.3px;
}

.service-card h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 20px;
}

.service-card div > p:last-child {
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.start-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 38px;
  margin: 0 32px;
  padding: 42px 46px;
  border-radius: var(--radius-large);
  background: var(--color-primary-deep);
  color: #ffffff;
}

.start-section .eyebrow {
  color: #9fbeaa;
}

.start-section h2 {
  margin: 0;
  font-size: 29px;
  letter-spacing: -0.8px;
}

.start-section p:not(.eyebrow) {
  max-width: 660px;
  margin: 9px 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
  line-height: 1.7;
}

.start-section .el-button {
  flex-shrink: 0;
  min-height: 48px;
  padding: 0 24px;
  border-color: #ffffff;
  background: #ffffff;
  color: var(--color-primary-deep);
  font-weight: 800;
}

@media (max-width: 1000px) {
  .welcome-hero {
    grid-template-columns: 1fr;
  }

  .hero-content {
    padding: 58px 48px 20px;
  }

  .landscape {
    min-height: 350px;
  }

  .mountain-main {
    right: 20%;
    width: 470px;
    height: 340px;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .welcome-page {
    padding: 20px 16px 54px;
  }

  .welcome-hero {
    border-radius: 20px;
  }

  .hero-content {
    padding: 42px 24px 15px;
  }

  .hero-content h1 {
    font-size: 43px;
    letter-spacing: -2px;
  }

  .hero-description {
    font-size: 15px;
  }

  .hero-meta {
    gap: 18px;
    margin-top: 36px;
  }

  .landscape {
    min-height: 260px;
  }

  .sun {
    top: 34px;
    right: 45px;
    width: 62px;
    height: 62px;
  }

  .cloud-small {
    top: 75px;
    left: 30px;
  }

  .cloud-large {
    top: 105px;
    right: 16px;
  }

  .mountain-left {
    width: 220px;
    height: 180px;
  }

  .mountain-right {
    width: 240px;
    height: 205px;
  }

  .mountain-main {
    right: 5%;
    width: 330px;
    height: 245px;
  }

  .service-intro {
    padding: 60px 0 50px;
  }

  .section-heading h2 {
    font-size: 27px;
  }

  .service-card {
    padding: 24px 20px;
  }

  .start-section {
    align-items: flex-start;
    flex-direction: column;
    margin: 0;
    padding: 34px 26px;
  }

  .start-section .el-button {
    width: 100%;
  }
}
</style>
