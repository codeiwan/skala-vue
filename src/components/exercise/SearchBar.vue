<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (value) => {
  emit('update-query', value)
}
</script>

<template>
  <section class="search-control">
    <div class="control-heading">
      <div>
        <p class="control-label">CITY SEARCH</p>
        <h3>도시 검색</h3>
        <p class="control-description">전국 주요 도시의 현재 날씨를 찾아볼 수 있어요.</p>
      </div>

      <el-tag type="info" effect="plain">
        {{ query ? `"${query}" 검색 중` : '전체 도시' }}
      </el-tag>
    </div>

    <el-input
      :model-value="query"
      size="large"
      clearable
      placeholder="도시 이름을 입력하세요. 예: 서울, 부산, 제주"
      @input="handleInput"
      @clear="handleInput('')"
    />
  </section>
</template>

<style scoped>
.search-control {
  width: 100%;
}

.control-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.control-label {
  margin: 0 0 5px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.3px;
}

.control-heading h3 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 18px;
}

.control-description {
  margin: 7px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 11px;
}

@media (max-width: 600px) {
  .control-heading {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
