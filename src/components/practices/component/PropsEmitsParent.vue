<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

// 1단계: String
const message = ref('Parent 초기 메시지')
const handleUpdateRequest = (newValue) => {
  message.value = newValue
}

// 2단계: Number
const count = ref(0)
const handleUpdateCount = (newCount) => {
  count.value = newCount
}

// 3단계: Object
const user = ref({ name: '홍길동', age: 20 })
const handleUpdateUser = (newUser) => {
  user.value = newUser
}

// 4단계: 함수(콜백) Props
const handleChildAction = (data) => {
  message.value = `[콜백 호출됨] ${data}`
}
</script>

<template>
  <div class="practice-section">
    <h2>Props & Emits</h2>
    <div class="parent-container">
      <h2>상위 컴포넌트 (Parent)</h2>
      <p>
        1단계 String 상태: <strong>{{ message }}</strong>
      </p>
      <p>
        2단계 Number 상태: <strong>{{ count }}</strong>
      </p>
      <p>
        3단계 Object 상태: <strong>{{ user.name }} ({{ user.age }}세)</strong>
      </p>
      <PropsEmitsChild
        :parentData="message"
        :count="count"
        :user="user"
        :onAction="handleChildAction"
        @update-request="handleUpdateRequest"
        @update-count="handleUpdateCount"
        @update-user="handleUpdateUser"
      />
    </div>
  </div>
</template>
