<script setup>
defineProps({
  // 1단계: String
  parentData: {
    type: String,
    required: true,
  },
  // 2단계: Number
  count: {
    type: Number,
    required: true,
  },
  // 3단계: Object
  user: {
    type: Object,
    required: true,
  },
  // 4단계: Function (콜백 props)
  onAction: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update-request', 'update-count', 'update-user'])

// 1단계: String emit
const sendNotification = () => {
  const payload = 'Child에서 가공한 새로운 데이터'
  emit('update-request', payload)
}
</script>

<template>
  <div class="child-container">
    <h2>하위 컴포넌트 (Child)</h2>

    <section>
      <h3>1단계: String</h3>
      <p>
        수신된 Props 데이터: <strong>{{ parentData }}</strong>
      </p>
      <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>
    </section>

    <br />

    <section>
      <h3>2단계: Number</h3>
      <p>
        수신된 count: <strong>{{ count }}</strong>
      </p>
      <button @click="emit('update-count', count + 1)">카운트 증가 요청 (Emit)</button>
    </section>

    <br />

    <section>
      <h3>3단계: Object</h3>
      <p>
        수신된 user: <strong>{{ user.name }} ({{ user.age }}세)</strong>
      </p>
      <button @click="emit('update-user', { name: user.name, age: user.age + 1 })">
        나이 변경 요청 (Emit)
      </button>
    </section>

    <br />

    <section>
      <h3>4단계: 함수(콜백) Props</h3>
      <p>부모가 내려준 함수를 자식이 직접 호출합니다.</p>
      <button @click="onAction('Child에서 함수 직접 호출로 전달한 데이터')">
        콜백 함수 직접 호출
      </button>
    </section>
  </div>
</template>
