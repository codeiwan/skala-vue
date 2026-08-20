<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="city-search">도시 검색</label>

    <input
      id="city-search"
      type="text"
      :value="query"
      placeholder="도시 이름을 한글로 입력하세요"
      @input="handleInput"
    />

    <p class="search-result">
      검색 중인 도시:
      <strong>
        {{ query || '전체 도시' }}
      </strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar label {
  display: block;

  margin-bottom: 10px;

  font-weight: 700;
}

.search-bar input {
  width: 100%;

  box-sizing: border-box;

  padding: 12px 14px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  font-size: 16px;
}

.search-result {
  margin: 12px 0 0;

  color: #4b5563;
}
</style>
