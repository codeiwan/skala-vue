<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const scoreLevels = [
  {
    range: '85 ~ 100',
    label: '산행하기 매우 좋은 환경',
    type: 'success',
    description: '기상 조건이 비교적 안정적인 상태예요.',
  },
  {
    range: '70 ~ 84',
    label: '산행하기 좋은 환경',
    type: 'success',
    description: '대체로 산행하기 좋지만 현지 기상 변화는 계속 확인해 주세요.',
  },
  {
    range: '50 ~ 69',
    label: '주의하며 산행 가능',
    type: 'warning',
    description: '환경을 확인하고 비교적 짧고 안전한 코스를 선택하는 편이 좋아요.',
  },
  {
    range: '0 ~ 49',
    label: '산행을 권장하지 않음',
    type: 'danger',
    description: '현재 환경이라면 산행 일정을 다시 검토하는 편이 좋아요.',
  },
]

const conditionFactors = [
  {
    number: '01',
    title: '기온',
    description: '지나치게 덥거나 추운 환경에서 발생할 수 있는 체력 소모를 고려해요.',
  },
  {
    number: '02',
    title: '습도',
    description: '높은 습도로 인한 체감 피로와 산행 부담을 함께 살펴봐요.',
  },
  {
    number: '03',
    title: '풍속',
    description: '능선이나 정상처럼 노출된 구간에서 영향을 크게 받을 수 있는 바람을 확인해요.',
  },
  {
    number: '04',
    title: '기상 상태',
    description: '비와 눈, 뇌우, 안개처럼 산행에 직접 영향을 줄 수 있는 상태를 반영해요.',
  },
  {
    number: '05',
    title: '가시거리',
    description: '주변 상황과 진행 방향을 파악하기 어려워지는 낮은 가시거리를 확인해요.',
  },
  {
    number: '06',
    title: '대기질',
    description:
      'OpenWeatherMap AQI를 기준으로 장시간 야외활동에 부담이 될 수 있는 상태를 살펴봐요.',
  },
]

const handleThresholdChange = (value) => {
  configStore.setHikingScoreThreshold(value)
}
</script>

<template>
  <div class="guide-page">
    <main class="guide-container">
      <header class="guide-hero">
        <div>
          <p class="eyebrow">HIKING GUIDE</p>
          <h1>
            산행 환경 점수를 이해하고<br />
            나만의 기준도 정해보세요.
          </h1>

          <p class="hero-description">
            Hiking Condition이 어떤 환경 요소를 살펴보는지 확인하고, 내가 산행하기 좋다고 생각하는
            기준 점수도 직접 설정할 수 있어요.
          </p>
        </div>

        <div class="hero-score" aria-hidden="true">
          <span>HIKING</span>
          <strong>70+</strong>
          <small>YOUR STANDARD</small>
        </div>
      </header>

      <el-alert
        title="Hiking Condition은 산 정상의 정밀 예보나 현장 안전 통제를 대신하지 않는 참고용 정보입니다."
        type="info"
        :closable="false"
        show-icon
        class="guide-alert"
      />

      <el-card shadow="never" class="preference-card">
        <div class="preference-top">
          <div>
            <p class="eyebrow">MY HIKING PREFERENCE</p>
            <h2>내 산행 추천 기준</h2>
            <p>
              어느 정도의 환경 점수부터 산행하기 좋은 상태라고 볼지 정해보세요. 설정한 값은 실제
              점수 계산을 바꾸지 않고 내 기준 충족 여부를 판단할 때만 사용해요.
            </p>
          </div>

          <div class="threshold-value">
            <strong>{{ configStore.hikingScoreThreshold }}</strong>
            <span>점 이상</span>
          </div>
        </div>

        <div class="slider-section">
          <div class="slider-labels">
            <span>가볍게</span>
            <span>신중하게</span>
          </div>

          <div class="slider-row">
            <strong>50</strong>

            <el-slider
              :model-value="configStore.hikingScoreThreshold"
              :min="50"
              :max="90"
              :step="5"
              show-stops
              @update:model-value="handleThresholdChange"
            />

            <strong>90</strong>
          </div>
        </div>

        <div class="preference-example">
          <span>EXAMPLE</span>
          <p>
            기준을 <strong>80점</strong>으로 설정하고 현재 Hiking Condition이 75점이라면 산 상세
            화면에서 <em>내 추천 기준 미달</em>로 표시돼요.
          </p>
        </div>
      </el-card>

      <section class="guide-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SCORE LEVEL</p>
            <h2>점수는 이렇게 나누어 보고 있어요.</h2>
          </div>
        </div>

        <div class="score-grid">
          <article v-for="level in scoreLevels" :key="level.range" class="score-card">
            <div class="score-range">
              <strong>{{ level.range }}</strong>
              <span>POINT</span>
            </div>

            <div class="score-content">
              <el-tag :type="level.type" effect="light">
                {{ level.label }}
              </el-tag>

              <p>{{ level.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="guide-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CONDITION FACTORS</p>
            <h2>오늘의 점수에는 이런 환경이 반영돼요.</h2>
          </div>
        </div>

        <div class="factor-grid">
          <article v-for="factor in conditionFactors" :key="factor.number" class="factor-card">
            <span class="factor-number">{{ factor.number }}</span>

            <div>
              <h3>{{ factor.title }}</h3>
              <p>{{ factor.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="usage-section">
        <div>
          <p class="eyebrow">HOW TO USE</p>
          <h2>산행 전에는 이렇게 확인해 보세요.</h2>
        </div>

        <ol>
          <li>
            <span>01</span>
            <p><strong>가고 싶은 산을 검색</strong>하고 높이와 위치, 산행 정보를 확인해요.</p>
          </li>
          <li>
            <span>02</span>
            <p><strong>현재 날씨와 대기질</strong>을 확인해 오늘의 주변 환경을 살펴봐요.</p>
          </li>
          <li>
            <span>03</span>
            <p><strong>Hiking Condition</strong>과 주의사항을 참고해 산행 계획을 점검해요.</p>
          </li>
          <li>
            <span>04</span>
            <p><strong>내 추천 기준</strong>과 현재 점수를 비교해 개인적인 판단에 활용해요.</p>
          </li>
        </ol>
      </section>
    </main>
  </div>
</template>

<style scoped>
.guide-page {
  min-height: 100vh;
  padding: 46px 24px 80px;
  background: var(--color-background);
  color: var(--color-text);
}

.guide-container {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.8px;
}

.guide-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 42px;
  margin-bottom: 24px;
  padding: 46px 48px;
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f8faf6 0%, #e5eee7 100%);
}

.guide-hero h1 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: clamp(38px, 5vw, 54px);
  line-height: 1.16;
  letter-spacing: -2px;
}

.hero-description {
  max-width: 700px;
  margin: 18px 0 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.hero-score {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  min-width: 165px;
  color: var(--color-primary);
}

.hero-score > span,
.hero-score > small {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.hero-score strong {
  margin: 4px 0;
  font-size: 56px;
  line-height: 1;
}

.guide-alert {
  margin-bottom: 24px;
}

.preference-card {
  margin-bottom: 52px;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

.preference-card :deep(.el-card__body) {
  padding: 34px 38px;
}

.preference-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
}

.preference-top h2 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 27px;
  letter-spacing: -0.8px;
}

.preference-top > div:first-child > p:last-child {
  max-width: 750px;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.threshold-value {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  gap: 4px;
  color: var(--color-primary);
}

.threshold-value strong {
  font-size: 48px;
  line-height: 1;
}

.threshold-value span {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.slider-section {
  margin-top: 34px;
  padding: 24px 28px;
  border-radius: 14px;
  background: var(--color-primary-softer);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 800;
}

.slider-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 16px;
}

.slider-row > strong {
  color: var(--color-primary);
  font-size: 12px;
}

.preference-example {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border-soft);
}

.preference-example > span {
  padding-top: 3px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.preference-example p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.preference-example em {
  color: var(--color-warning);
  font-style: normal;
  font-weight: 800;
}

.guide-section {
  margin-bottom: 54px;
}

.section-heading {
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 28px;
  letter-spacing: -0.9px;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.score-card {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  min-height: 150px;
  padding: 25px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-medium);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.score-range {
  display: flex;
  flex-direction: column;
}

.score-range strong {
  color: var(--color-primary);
  font-size: 25px;
}

.score-range span {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.score-content p {
  margin: 11px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

.factor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.factor-card {
  min-height: 190px;
  padding: 25px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-medium);
  background: var(--color-surface);
}

.factor-number {
  color: #a8bcad;
  font-size: 10px;
  font-weight: 900;
}

.factor-card h3 {
  margin: 25px 0 8px;
  color: var(--color-primary-deep);
  font-size: 19px;
}

.factor-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.usage-section {
  padding: 38px 42px;
  border-radius: var(--radius-large);
  background: var(--color-primary-deep);
  color: #ffffff;
}

.usage-section h2 {
  margin: 0;
  font-size: 27px;
  letter-spacing: -0.8px;
}

.usage-section .eyebrow {
  color: #9fbeaa;
}

.usage-section ol {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.usage-section li {
  display: flex;
  gap: 15px;
  padding: 21px 18px 21px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.usage-section li:nth-child(even) {
  padding-left: 22px;
  border-left: 1px solid rgba(255, 255, 255, 0.14);
}

.usage-section li > span {
  color: #9fbeaa;
  font-size: 10px;
  font-weight: 900;
}

.usage-section li p {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  line-height: 1.65;
}

.usage-section li strong {
  color: #ffffff;
}

@media (max-width: 850px) {
  .factor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .guide-page {
    padding: 30px 16px 58px;
  }
  .guide-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 34px 25px;
  }
  .guide-hero h1 {
    font-size: 38px;
  }
  .hero-score {
    align-items: flex-start;
  }
  .preference-card :deep(.el-card__body) {
    padding: 27px 21px;
  }
  .preference-top {
    flex-direction: column;
  }
  .score-grid,
  .factor-grid,
  .usage-section ol {
    grid-template-columns: 1fr;
  }
  .score-card {
    grid-template-columns: 1fr;
    gap: 13px;
  }
  .usage-section {
    padding: 32px 24px;
  }
  .usage-section li:nth-child(even) {
    padding-left: 0;
    border-left: none;
  }
}
</style>
