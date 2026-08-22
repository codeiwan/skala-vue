<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const scoreLevels = [
  {
    range: '85 ~ 100',
    label: '산행하기 매우 좋은 환경',
    type: 'success',
    description: '기상 조건이 비교적 안정적인 상태입니다.',
  },
  {
    range: '70 ~ 84',
    label: '산행하기 좋은 환경',
    type: 'success',
    description: '대체로 산행하기 좋지만 현지 기상 변화를 확인하세요.',
  },
  {
    range: '50 ~ 69',
    label: '주의하며 산행 가능',
    type: 'warning',
    description: '기상 요소를 확인하고 짧고 안전한 코스를 권장합니다.',
  },
  {
    range: '0 ~ 49',
    label: '산행을 권장하지 않음',
    type: 'danger',
    description: '현재 환경에서는 산행 일정을 다시 검토하는 것이 좋습니다.',
  },
]

const conditionFactors = [
  {
    title: '기온',
    description: '고온과 저온에서는 체력 소모와 안전 위험을 고려합니다.',
  },
  {
    title: '습도',
    description: '습도가 높을수록 산행 중 체감 피로가 증가할 수 있습니다.',
  },
  {
    title: '풍속',
    description: '강한 바람은 능선과 정상처럼 노출된 구간에서 위험요소가 됩니다.',
  },
  {
    title: '기상 상태',
    description: '비, 눈, 뇌우, 안개 등 산행에 직접 영향을 주는 상태를 반영합니다.',
  },
  {
    title: '가시거리',
    description: '가시거리가 짧으면 길 찾기와 주변 상황 파악이 어려워질 수 있습니다.',
  },
  {
    title: '대기질',
    description: 'OpenWeatherMap AQI를 참고해 장시간 야외활동 부담을 반영합니다.',
  },
]

const handleThresholdChange = (value) => {
  configStore.setHikingScoreThreshold(value)
}
</script>

<template>
  <div class="guide-page">
    <main class="guide-container">
      <header class="guide-header">
        <p class="eyebrow">HIKING GUIDE</p>
        <h1>산행 환경 점수는 어떻게 볼까요?</h1>
        <p class="description">
          Hiking Signal은 산의 대표 지역 기상정보와 대기질을 이용해 현재 산행 환경을 참고용 점수로
          제공합니다.
        </p>
      </header>

      <el-alert
        title="Hiking Condition은 실제 산 정상의 정밀 예보나 안전 통제를 대신하지 않는 참고용 정보입니다."
        type="info"
        :closable="false"
        show-icon
        class="guide-alert"
      />

      <el-card shadow="never" class="preference-card">
        <template #header>
          <div class="preference-heading">
            <div>
              <p class="section-label">MY HIKING PREFERENCE</p>
              <strong>내 산행 추천 기준</strong>
            </div>

            <el-tag type="success" effect="plain" size="large">
              {{ configStore.hikingThresholdLabel }}
            </el-tag>
          </div>
        </template>

        <p class="preference-description">
          어느 정도의 산행 환경 점수부터 개인적으로 산행하기 좋은 상태라고 볼지 설정할 수 있습니다.
          이 설정은 실제 Hiking Condition 계산 결과를 변경하지 않고, 내 기준 충족 여부를 판단하는 데
          사용됩니다.
        </p>

        <div class="slider-area">
          <span>50</span>

          <el-slider
            :model-value="configStore.hikingScoreThreshold"
            :min="50"
            :max="90"
            :step="5"
            show-stops
            @update:model-value="handleThresholdChange"
          />

          <span>90</span>
        </div>

        <div class="preference-example">
          예를 들어 기준을 80점으로 설정하면 Hiking Condition이 75점인 경우
          <strong>내 추천 기준 미달</strong>로 표시됩니다.
        </div>
      </el-card>

      <section class="guide-section">
        <div class="section-heading">
          <p class="section-label">SCORE LEVEL</p>
          <h2>점수별 의미</h2>
        </div>

        <div class="score-grid">
          <el-card
            v-for="level in scoreLevels"
            :key="level.range"
            shadow="never"
            class="score-card"
          >
            <div class="score-heading">
              <strong>{{ level.range }}</strong>
              <el-tag :type="level.type">{{ level.label }}</el-tag>
            </div>

            <p>{{ level.description }}</p>
          </el-card>
        </div>
      </section>

      <section class="guide-section">
        <div class="section-heading">
          <p class="section-label">CONDITION FACTORS</p>
          <h2>판단에 사용하는 환경 요소</h2>
        </div>

        <div class="factor-grid">
          <el-card
            v-for="factor in conditionFactors"
            :key="factor.title"
            shadow="never"
            class="factor-card"
          >
            <strong>{{ factor.title }}</strong>
            <p>{{ factor.description }}</p>
          </el-card>
        </div>
      </section>

      <el-card shadow="never" class="usage-card">
        <template #header>
          <strong>사용 방법</strong>
        </template>

        <ol>
          <li>산 찾기에서 방문하려는 산을 검색합니다.</li>
          <li>산 상세정보에서 소재지와 추천 산행 코스를 확인합니다.</li>
          <li>대표 지역의 현재 기상정보와 대기질을 확인합니다.</li>
          <li>Hiking Condition과 주의사항을 참고해 산행 여부를 판단합니다.</li>
          <li>내 추천 기준과 현재 점수를 비교해 개인적인 산행 판단에 활용합니다.</li>
        </ol>
      </el-card>
    </main>
  </div>
</template>

<style scoped>
.guide-page {
  min-height: 100vh;
  padding: 48px 24px 64px;
  background: #f4f7fb;
  color: #1f2937;
}
.guide-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.guide-header {
  margin-bottom: 24px;
}
.eyebrow,
.section-label {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.guide-header h1 {
  margin: 0;
  font-size: 38px;
  letter-spacing: -0.8px;
}
.description {
  max-width: 760px;
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.7;
}
.guide-alert {
  margin-bottom: 24px;
}

.preference-card {
  margin-bottom: 34px;
  border-radius: 16px;
}
.preference-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.preference-heading strong {
  font-size: 20px;
}
.preference-description {
  max-width: 800px;
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}
.slider-area {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  max-width: 760px;
  margin-top: 24px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
}
.preference-example {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}
.preference-example strong {
  color: #d97706;
}

.guide-section {
  margin-bottom: 34px;
}
.section-heading {
  margin-bottom: 16px;
}
.section-heading h2 {
  margin: 0;
  font-size: 24px;
}
.score-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.score-card,
.factor-card,
.usage-card {
  border-radius: 14px;
}
.score-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.score-heading strong {
  font-size: 22px;
  color: #2563eb;
}
.score-card p,
.factor-card p {
  margin: 12px 0 0;
  color: #64748b;
  line-height: 1.65;
}

.factor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.factor-card strong {
  font-size: 17px;
}
.usage-card ol {
  margin: 0;
  padding-left: 22px;
  color: #475569;
  line-height: 2;
}

@media (max-width: 800px) {
  .factor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .guide-page {
    padding: 34px 16px 52px;
  }
  .guide-header h1 {
    font-size: 30px;
  }
  .preference-heading,
  .score-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .score-grid,
  .factor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
