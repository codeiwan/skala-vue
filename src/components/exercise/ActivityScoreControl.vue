<script setup>
defineProps({
  minActivityScore: {
    type: Number,
    required: true,
  },

  recommendedCityCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update-score'])

const updateScore = (score) => {
  emit('update-score', score)
}
</script>

<template>
  <div class="activity-score-control">
    <label>Activity Insight 추천 기준</label>

    <p class="score-description">
      활동 적합도
      <strong>{{ minActivityScore }}점 이상</strong>인 도시를 추천 도시로 판단합니다.
    </p>

    <div class="score-buttons">
      <button class="score-button" @click="updateScore(60)">60점</button>

      <button class="score-button" @click="updateScore(70)">70점</button>

      <button class="score-button" @click="updateScore(80)">80점</button>
    </div>

    <p class="score-description">
      현재 기준을 만족하는 추천 도시:
      <strong>{{ recommendedCityCount }}개</strong>
    </p>
  </div>
</template>

<style scoped>
.activity-score-control label {
  display: block;

  margin-bottom: 10px;

  font-weight: 700;
}

.score-description {
  margin: 12px 0 0;

  color: #4b5563;
}

.score-buttons {
  display: flex;

  gap: 8px;

  margin-top: 16px;
}

.score-button {
  padding: 9px 16px;

  border: 1px solid #bfdbfe;
  border-radius: 8px;

  background-color: #eff6ff;
  color: #1d4ed8;

  font-weight: 700;

  cursor: pointer;
}

.score-button:hover {
  background-color: #dbeafe;
}
</style>
