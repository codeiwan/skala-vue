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
        <p class="control-title">도시 검색</p>

        <p class="control-description">전국 주요 도시의 실시간 날씨를 검색합니다.</p>
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

.control-title {
  margin: 0;
  font-weight: 700;
  color: #1f2937;
}

.control-description {
  margin: 7px 0 0;
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 600px) {
  .control-heading {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
