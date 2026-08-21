<script setup>
import { computed, ref } from 'vue'

// ======================================================
// Vue 시작
// ======================================================

import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'

// ======================================================
// Vue Directive
// ======================================================

import VueHtml from '@/components/practices/basic/VueHtml.vue'
import VueHtmlXss from '@/components/practices/basic/VueHtmlXss.vue'
import VueText from '@/components/practices/basic/VueText.vue'

import VueBind from '@/components/practices/basic/VueBind.vue'
import VueBindClass from '@/components/practices/basic/VueBindClass.vue'
import VueBindStyle from '@/components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from '@/components/practices/basic/VueBindShorthand.vue'

import VueIf from '@/components/practices/basic/VueIf.vue'
import VueShow from '@/components/practices/basic/VueShow.vue'
import VueFor from '@/components/practices/basic/VueFor.vue'

// ======================================================
// Event Handling
// ======================================================

import EventBasic from '@/components/practices/basic/EventBasic.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'

// ======================================================
// Form / Style
// ======================================================

import ModelBasic from '@/components/practices/basic/ModelBasic.vue'
import ModelForm from '@/components/practices/basic/ModelForm.vue'
import ModelModifier from '@/components/practices/basic/ModelModifier.vue'
import StyleScoped from '@/components/practices/basic/StyleScoped.vue'

// ======================================================
// Composition API
// ======================================================

import ReactiveRef from '@/components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '@/components/practices/composition/ReactiveReactive.vue'

import ComputedBasic from '@/components/practices/composition/ComputedBasic.vue'
import WatchersBasic from '@/components/practices/composition/WatchersBasic.vue'
import WatchersMulti from '@/components/practices/composition/WatchersMulti.vue'
import WatchersDeep from '@/components/practices/composition/WatchersDeep.vue'
import WatchersReactive from '@/components/practices/composition/WatchersReactive.vue'
import WatchersWatchEffect from '@/components/practices/composition/WatchersWatchEffect.vue'

// ======================================================
// Vue Components
// ======================================================

import LifecycleParent from '@/components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '@/components/practices/component/PropsEmitsParent.vue'

import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'

// ======================================================
// Library
// ======================================================

import StoreCounter from '@/components/practices/library/StoreCounter.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
import AxiosJson from '@/components/practices/library/AxiosJson.vue'
import ElementPlus from '@/components/practices/library/ElementPlus.vue'

// ======================================================
// Practice Catalog
// ======================================================

const practiceGroups = [
  {
    id: 'getting-started',
    title: 'Vue 시작',
    subtitle: 'Reactivity와 Text Interpolation',
    description: 'Vue 화면이 JavaScript 데이터와 연결되는 가장 기본적인 과정을 확인합니다.',
    practices: [
      {
        id: 'sample-one',
        title: 'Reactive State',
        shortTitle: 'Reactivity',
        description:
          '반응형 데이터가 변경되면 화면이 자동으로 갱신되는 Vue의 기본 동작을 확인합니다.',
        component: SampleOne,
      },
      {
        id: 'sample-two',
        title: 'Text Interpolation',
        shortTitle: 'Interpolation',
        description: '{{ }} 내부에서 데이터와 JavaScript 표현식을 사용하는 방법을 확인합니다.',
        component: SampleTwo,
      },
    ],
  },

  {
    id: 'directive',
    title: 'Vue Directive',
    subtitle: 'v-html · v-text · v-bind',
    description: 'HTML 요소와 Vue 데이터를 연결하는 주요 Directive를 직접 실행합니다.',
    practices: [
      {
        id: 'vue-html',
        title: 'v-html',
        shortTitle: 'v-html',
        description: '문자열을 실제 HTML 마크업으로 렌더링하는 동작을 비교합니다.',
        component: VueHtml,
      },
      {
        id: 'vue-html-xss',
        title: 'v-html & XSS',
        shortTitle: 'XSS',
        description:
          'v-html 사용 시 신뢰하지 않는 HTML이 왜 위험한지 확인하는 보안 학습 예제입니다.',
        component: VueHtmlXss,
        warning: true,
      },
      {
        id: 'vue-text',
        title: 'v-text',
        shortTitle: 'v-text',
        description: 'v-text와 Text Interpolation의 출력 차이를 비교합니다.',
        component: VueText,
      },
      {
        id: 'vue-bind',
        title: 'v-bind Basic',
        shortTitle: 'Bind',
        description: 'HTML Attribute에 Vue 데이터를 동적으로 연결합니다.',
        component: VueBind,
      },
      {
        id: 'vue-bind-class',
        title: 'Class Binding',
        shortTitle: 'Class',
        description: '상태에 따라 CSS Class를 동적으로 적용합니다.',
        component: VueBindClass,
      },
      {
        id: 'vue-bind-style',
        title: 'Style Binding',
        shortTitle: 'Style',
        description: 'JavaScript 객체와 값을 이용해 Inline Style을 동적으로 변경합니다.',
        component: VueBindStyle,
      },
      {
        id: 'vue-bind-shorthand',
        title: 'v-bind Shorthand',
        shortTitle: 'Shorthand',
        description: 'v-bind의 축약형인 : 문법을 사용합니다.',
        component: VueBindShorthand,
      },
    ],
  },

  {
    id: 'rendering',
    title: '조건부 & 반복 렌더링',
    subtitle: 'v-if · v-show · v-for',
    description: '조건이나 배열 데이터에 따라 DOM을 생성하고 표시하는 방법을 확인합니다.',
    practices: [
      {
        id: 'vue-if',
        title: 'v-if',
        shortTitle: 'v-if',
        description: '조건에 따라 DOM 요소 자체를 생성하거나 제거합니다.',
        component: VueIf,
      },
      {
        id: 'vue-show',
        title: 'v-show',
        shortTitle: 'v-show',
        description: 'DOM은 유지하면서 CSS display 속성으로 표시 여부를 변경합니다.',
        component: VueShow,
      },
      {
        id: 'vue-for',
        title: 'v-for',
        shortTitle: 'v-for',
        description: '배열 데이터를 반복하여 여러 DOM 요소를 렌더링합니다.',
        component: VueFor,
      },
    ],
  },

  {
    id: 'event',
    title: 'Event Handling',
    subtitle: 'v-on / @',
    description: '사용자의 클릭과 입력 같은 이벤트를 Vue 로직과 연결합니다.',
    practices: [
      {
        id: 'event-basic',
        title: 'Event Basic',
        shortTitle: 'Basic',
        description: '기본적인 클릭 이벤트와 이벤트 핸들러를 확인합니다.',
        component: EventBasic,
      },
      {
        id: 'event-object',
        title: 'Event Object',
        shortTitle: 'Object',
        description: '브라우저가 전달하는 Event 객체의 정보를 활용합니다.',
        component: EventObject,
      },
      {
        id: 'event-modifier',
        title: 'Event Modifier',
        shortTitle: 'Modifier',
        description: '.stop, .prevent 등의 Event Modifier 동작을 확인합니다.',
        component: EventModifier,
      },
    ],
  },

  {
    id: 'form',
    title: 'Form & Style',
    subtitle: 'v-model · scoped CSS',
    description: '입력값의 양방향 바인딩과 컴포넌트 단위 Style 격리를 확인합니다.',
    practices: [
      {
        id: 'model-basic',
        title: 'v-model Basic',
        shortTitle: 'Basic',
        description: '입력 요소와 반응형 데이터를 양방향으로 연결합니다.',
        component: ModelBasic,
      },
      {
        id: 'model-form',
        title: 'Form Binding',
        shortTitle: 'Form',
        description: 'TextArea, Checkbox, Radio, Select 등 다양한 Form 요소를 다룹니다.',
        component: ModelForm,
      },
      {
        id: 'model-modifier',
        title: 'v-model Modifier',
        shortTitle: 'Modifier',
        description: 'v-model의 lazy, number, trim Modifier를 확인합니다.',
        component: ModelModifier,
      },
      {
        id: 'style-scoped',
        title: 'Scoped Style',
        shortTitle: 'Scoped CSS',
        description: '컴포넌트의 CSS가 다른 컴포넌트에 영향을 주지 않도록 범위를 격리합니다.',
        component: StyleScoped,
      },
    ],
  },

  {
    id: 'reactivity',
    title: 'Composition API',
    subtitle: 'ref · reactive · computed',
    description: 'Vue 3 Composition API의 핵심 반응형 상태와 계산된 값을 직접 확인합니다.',
    practices: [
      {
        id: 'reactive-ref',
        title: 'ref()',
        shortTitle: 'ref',
        description: '기본형 데이터를 반응형 Ref 객체로 관리합니다.',
        component: ReactiveRef,
      },
      {
        id: 'reactive-reactive',
        title: 'reactive()',
        shortTitle: 'reactive',
        description: '객체 형태의 상태를 반응형 Proxy로 관리합니다.',
        component: ReactiveReactive,
      },
      {
        id: 'computed-basic',
        title: 'computed()',
        shortTitle: 'computed',
        description: '의존 데이터가 변경될 때만 계산되는 Computed의 캐싱 특성을 확인합니다.',
        component: ComputedBasic,
      },
    ],
  },

  {
    id: 'watchers',
    title: 'Watchers',
    subtitle: 'watch · watchEffect',
    description: '반응형 상태의 변경을 감지하고 Side Effect를 실행하는 다양한 방식을 비교합니다.',
    practices: [
      {
        id: 'watch-basic',
        title: 'watch() Basic',
        shortTitle: 'Basic',
        description: '단일 반응형 값을 명시적으로 감시합니다.',
        component: WatchersBasic,
      },
      {
        id: 'watch-multi',
        title: 'Multi Watch',
        shortTitle: 'Multi',
        description: '여러 반응형 값을 동시에 감시합니다.',
        component: WatchersMulti,
      },
      {
        id: 'watch-deep',
        title: 'Deep Watch',
        shortTitle: 'Deep',
        description: '중첩 객체 내부 값의 변경까지 감시합니다.',
        component: WatchersDeep,
      },
      {
        id: 'watch-reactive',
        title: 'Reactive Watch',
        shortTitle: 'Reactive',
        description: 'reactive 객체와 watcher의 동작을 확인합니다.',
        component: WatchersReactive,
      },
      {
        id: 'watch-effect',
        title: 'watchEffect()',
        shortTitle: 'watchEffect',
        description: '콜백 안에서 사용된 반응형 의존성을 Vue가 자동 추적합니다.',
        component: WatchersWatchEffect,
      },
    ],
  },

  {
    id: 'component',
    title: 'Vue Components',
    subtitle: 'Lifecycle · Props · Emits',
    description: '컴포넌트의 생명주기와 Parent-Child 데이터 통신을 확인합니다.',
    practices: [
      {
        id: 'lifecycle',
        title: 'Lifecycle Hooks',
        shortTitle: 'Lifecycle',
        description: 'Mount, Update, Unmount 과정에서 Lifecycle Hook이 호출되는 순서를 확인합니다.',
        component: LifecycleParent,
      },
      {
        id: 'props-emits',
        title: 'Props & Emits',
        shortTitle: 'Props / Emits',
        description: '부모 → 자식 Props 전달과 자식 → 부모 Emits 이벤트 흐름을 확인합니다.',
        component: PropsEmitsParent,
      },
    ],
  },

  {
    id: 'slot',
    title: 'Component Slot',
    subtitle: 'Default · Named · Scoped',
    description:
      '부모가 자식 컴포넌트의 특정 영역에 콘텐츠를 주입하는 세 가지 Slot 방식을 비교합니다.',
    practices: [
      {
        id: 'slot-default',
        title: 'Default Slot',
        shortTitle: 'Default',
        description: '하나의 기본 Slot 영역에 부모 콘텐츠를 주입합니다.',
        component: SlotDefaultParent,
      },
      {
        id: 'slot-named',
        title: 'Named Slot',
        shortTitle: 'Named',
        description: '여러 Slot 영역을 이름으로 구분하여 콘텐츠를 주입합니다.',
        component: SlotNamedParent,
      },
      {
        id: 'slot-scoped',
        title: 'Scoped Slot',
        shortTitle: 'Scoped',
        description: '자식이 가진 데이터를 부모의 Slot 콘텐츠에서 활용합니다.',
        component: SlotScopedParent,
      },
    ],
  },

  {
    id: 'library',
    title: 'State · API · UI Library',
    subtitle: 'Pinia · Axios · Element Plus',
    description: 'Vue Application을 실제 서비스 구조로 발전시키는 외부 Library 활용을 확인합니다.',
    practices: [
      {
        id: 'store-counter',
        title: 'Pinia Store',
        shortTitle: 'Pinia',
        description: '컴포넌트 바깥의 Store에서 전역 반응형 상태를 관리합니다.',
        component: StoreCounter,
      },
      {
        id: 'axios-weather',
        title: 'Axios Weather',
        shortTitle: 'Axios Weather',
        description: 'Axios를 이용한 비동기 HTTP 요청과 응답 데이터 처리를 확인합니다.',
        component: AxiosWeather,
      },
      {
        id: 'axios-json',
        title: 'Axios JSON',
        shortTitle: 'Axios JSON',
        description: '외부 JSON 데이터를 비동기로 가져와 Vue 화면에 렌더링합니다.',
        component: AxiosJson,
      },
      {
        id: 'element-plus',
        title: 'Element Plus',
        shortTitle: 'Element Plus',
        description: '외부 UI Component Library를 Vue 애플리케이션에 적용합니다.',
        component: ElementPlus,
      },
    ],
  },
]

// ======================================================
// UI State
// ======================================================

const activeGroupId = ref(practiceGroups[0].id)
const activePracticeId = ref(practiceGroups[0].practices[0].id)

const activeGroup = computed(() => {
  return practiceGroups.find((group) => group.id === activeGroupId.value)
})

const activePractice = computed(() => {
  return activeGroup.value.practices.find((practice) => practice.id === activePracticeId.value)
})

const totalPracticeCount = computed(() => {
  return practiceGroups.reduce((count, group) => count + group.practices.length, 0)
})

const activePracticeNumber = computed(() => {
  const flattened = practiceGroups.flatMap((group) => group.practices)

  return flattened.findIndex((practice) => practice.id === activePractice.value.id) + 1
})

// ======================================================
// Navigation
// ======================================================

const selectGroup = (group) => {
  activeGroupId.value = group.id
  activePracticeId.value = group.practices[0].id
}

const selectPractice = (practice) => {
  activePracticeId.value = practice.id
}

const movePractice = (direction) => {
  const flattened = practiceGroups.flatMap((group) =>
    group.practices.map((practice) => ({
      groupId: group.id,
      practice,
    })),
  )

  const currentIndex = flattened.findIndex((item) => item.practice.id === activePractice.value.id)

  const targetIndex = currentIndex + direction

  if (targetIndex < 0 || targetIndex >= flattened.length) {
    return
  }

  const target = flattened[targetIndex]

  activeGroupId.value = target.groupId
  activePracticeId.value = target.practice.id
}
</script>

<template>
  <div class="practice-page">
    <main class="practice-container">
      <!-- Header -->
      <header class="practice-header">
        <div>
          <p class="eyebrow">VUE LEARNING LAB</p>

          <h1>Vue Practice Playground</h1>

          <p class="description">
            강의에서 배운 Vue 핵심 기능을 직접 실행하고 다시 확인할 수 있는 개인 학습 공간입니다.
          </p>
        </div>

        <div class="header-statistics">
          <el-statistic title="학습 Section" :value="practiceGroups.length" />

          <el-statistic title="Practice" :value="totalPracticeCount" />
        </div>
      </header>

      <el-alert
        title="각 Practice는 한 번에 하나씩 실행됩니다. 버튼과 입력창을 직접 조작하고 필요한 예제에서는 Browser Console도 함께 확인하세요."
        type="info"
        :closable="false"
        show-icon
        class="guide-alert"
      />

      <div class="practice-layout">
        <!-- Left Navigation -->
        <aside class="practice-sidebar">
          <el-card shadow="never" class="navigation-card">
            <template #header>
              <div class="sidebar-heading">
                <span>Learning Map</span>

                <el-tag type="primary" effect="plain" size="small" round>
                  {{ activePracticeNumber }} / {{ totalPracticeCount }}
                </el-tag>
              </div>
            </template>

            <div class="group-list">
              <button
                v-for="group in practiceGroups"
                :key="group.id"
                :class="[
                  'group-button',
                  {
                    active: group.id === activeGroupId,
                  },
                ]"
                @click="selectGroup(group)"
              >
                <span>
                  {{ group.title }}
                </span>

                <small>
                  {{ group.practices.length }}
                </small>
              </button>
            </div>
          </el-card>
        </aside>

        <!-- Main Content -->
        <section class="practice-main">
          <!-- Group Description -->
          <el-card shadow="never" class="group-card">
            <div class="group-heading">
              <div>
                <p class="section-label">
                  {{ activeGroup.subtitle }}
                </p>

                <h2>
                  {{ activeGroup.title }}
                </h2>

                <p>
                  {{ activeGroup.description }}
                </p>
              </div>

              <el-tag type="info" effect="plain" round>
                {{ activeGroup.practices.length }} Practices
              </el-tag>
            </div>

            <div class="practice-selector">
              <el-button
                v-for="practice in activeGroup.practices"
                :key="practice.id"
                :type="practice.id === activePracticeId ? 'primary' : ''"
                :plain="practice.id !== activePracticeId"
                @click="selectPractice(practice)"
              >
                {{ practice.shortTitle }}
              </el-button>
            </div>
          </el-card>

          <!-- Current Practice -->
          <el-card shadow="never" class="stage-card">
            <template #header>
              <div class="stage-header">
                <div>
                  <div class="stage-title-row">
                    <span class="practice-number">
                      {{ String(activePracticeNumber).padStart(2, '0') }}
                    </span>

                    <h2>
                      {{ activePractice.title }}
                    </h2>

                    <el-tag v-if="activePractice.warning" type="warning" size="small">
                      Security Demo
                    </el-tag>
                  </div>

                  <p>
                    {{ activePractice.description }}
                  </p>
                </div>

                <el-tag type="success" effect="plain"> LIVE PRACTICE </el-tag>
              </div>
            </template>

            <el-alert
              v-if="activePractice.warning"
              title="교육용 보안 예제입니다. v-html에는 신뢰할 수 없는 HTML을 전달하면 안 됩니다."
              type="warning"
              :closable="false"
              show-icon
              class="practice-warning"
            />

            <!--
              선택한 Practice 하나만 실제 Mount한다.
              따라서 Lifecycle / Watcher / Axios 예제가
              불필요하게 동시에 실행되지 않는다.
            -->
            <div :key="activePractice.id" class="practice-stage">
              <component :is="activePractice.component" />
            </div>

            <div class="practice-footer">
              <el-button :disabled="activePracticeNumber === 1" @click="movePractice(-1)">
                이전 Practice
              </el-button>

              <span>
                {{ activePracticeNumber }}
                /
                {{ totalPracticeCount }}
              </span>

              <el-button
                type="primary"
                :disabled="activePracticeNumber === totalPracticeCount"
                @click="movePractice(1)"
              >
                다음 Practice
              </el-button>
            </div>
          </el-card>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.practice-page {
  min-height: 100vh;
  padding: 48px 24px 64px;
  background: #f4f7fb;
  color: #1f2937;
}

.practice-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.practice-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #2563eb;
}

.practice-header h1 {
  margin: 0;
  font-size: 38px;
  letter-spacing: -0.8px;
}

.description {
  max-width: 720px;
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.65;
}

.header-statistics {
  display: flex;
  gap: 34px;
  flex-shrink: 0;
}

.guide-alert {
  margin-bottom: 20px;
}

.practice-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.practice-sidebar {
  position: sticky;
  top: 86px;
}

.navigation-card,
.group-card,
.stage-card {
  border-radius: 16px;
}

.sidebar-heading,
.group-heading,
.stage-header,
.practice-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.sidebar-heading {
  font-weight: 700;
}

.group-list {
  display: grid;
  gap: 6px;
}

.group-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #475569;
  text-align: left;
  cursor: pointer;
}

.group-button:hover {
  background: #f8fafc;
}

.group-button.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
}

.group-button small {
  color: #94a3b8;
}

.practice-main {
  min-width: 0;
}

.group-card {
  margin-bottom: 20px;
}

.group-heading {
  align-items: flex-start;
}

.section-label {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.3px;
  color: #2563eb;
}

.group-heading h2 {
  margin: 0;
  font-size: 24px;
}

.group-heading p {
  margin: 8px 0 0;
  color: #64748b;
}

.practice-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.stage-header {
  align-items: flex-start;
}

.stage-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stage-title-row h2 {
  margin: 0;
  font-size: 24px;
}

.practice-number {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 800;
}

.stage-header p {
  margin: 8px 0 0;
  color: #64748b;
}

.practice-warning {
  margin-bottom: 18px;
}

.practice-stage {
  min-height: 300px;
  padding: 24px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow-x: auto;
}

.practice-footer {
  margin-top: 20px;
}

.practice-footer span {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .practice-header {
    flex-direction: column;
  }

  .practice-layout {
    grid-template-columns: 1fr;
  }

  .practice-sidebar {
    position: static;
  }

  .group-list {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 600px) {
  .practice-page {
    padding: 32px 16px 48px;
  }

  .practice-header h1 {
    font-size: 30px;
  }

  .header-statistics {
    width: 100%;
    justify-content: space-between;
  }

  .group-heading,
  .stage-header {
    flex-direction: column;
  }

  .practice-stage {
    padding: 14px;
  }

  .practice-footer {
    gap: 8px;
  }
}
</style>
