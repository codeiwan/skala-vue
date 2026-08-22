# HIKING SIGNAL

Vue.js 수업에서 진행한 Weather 실습을 바탕으로 확장한 산행 정보 서비스입니다.

산림청 공공데이터에서 산 정보를 조회하고, OpenWeatherMap의 날씨·대기질 데이터를 연결해 산행 전에 필요한 정보를 한곳에서 확인할 수 있도록 만들었습니다.

## 바로가기

| 화면              | 링크                                                          |
| ----------------- | ------------------------------------------------------------- |
| **Hiking Signal** | [서비스 바로가기](https://skala-vue-nine-xi.vercel.app/)      |
| **산행 가이드**   | [바로가기](https://skala-vue-nine-xi.vercel.app/hiking-guide) |
| **Weather**       | [바로가기](https://skala-vue-nine-xi.vercel.app/weather)      |
| **Vue Lab**       | [바로가기](https://skala-vue-nine-xi.vercel.app/practice)     |
| **About**         | [바로가기](https://skala-vue-nine-xi.vercel.app/about)        |

---

## 프로젝트 흐름

처음에는 수업에서 만든 Weather Dashboard 형태로 시작했다.

날씨를 조회하는 것에서 끝내기보다는 실제 사용 목적을 만들어보고 싶어서 산행 정보와 연결했고, 다음과 같이 확장했다.

```text
Weather 실습
    ↓
Router / Pinia / Axios 적용
    ↓
산림청 산 정보 API
    ↓
날씨 + 대기질 연결
    ↓
Hiking Condition
    ↓
HIKING SIGNAL
```

현재는 산 검색이 메인 기능이고, Weather와 Vue Lab은 기존 학습 과정도 함께 확인할 수 있도록 남겨두었다.

---

## 이 프로젝트에서 특히 신경 쓴 부분

단순히 수업 예제를 한 화면에 모으기보다 **배운 Vue 기능들이 실제로 필요해지는 구조를 만드는 것**에 신경 썼다.

### 1. Pinia를 실제 공유 상태에 사용

산행 가이드에서 개인 추천 기준을 변경하면 산 상세 화면에서도 같은 기준을 바로 사용한다.

```text
HikingGuideView
      ↓
configStore
      ↓
MountainDetailView
```

Counter 실습을 넘어, 서로 다른 화면이 같은 상태를 공유해야 하는 상황에 Pinia를 적용했다.

### 2. 서로 다른 API를 하나의 흐름으로 연결

```text
산 검색
  ↓
산림청 API
  ↓
산 소재지
  ↓
대표 기상 지역
  ↓
Weather API
  ↓
좌표
  ↓
Air Pollution API
```

API를 각각 보여주는 것이 아니라 앞의 결과를 다음 요청에 활용하도록 연결했다.

### 3. 실제 공공데이터의 문제도 처리

산림청 API는 수업에서 주로 사용했던 JSON이 아니라 XML을 반환했기 때문에 `DOMParser`로 필요한 데이터를 객체로 변환했다.

또한 `&nbsp;`, `<BR>`, 오래된 `.swf` 주소처럼 화면에서 그대로 사용하기 어려운 값은 `mountainApi.js`에서 먼저 정리했다.

### 4. 데이터가 부족해도 UI가 자연스럽게 보이도록 처리

산마다 제공되는 정보가 달라 처음에는

```text
01 기본 정보
06 상세 이야기
```

처럼 번호가 건너뛰는 문제가 있었다.

현재는 실제로 존재하는 데이터만 렌더링하고 번호도 다시 계산한다.

이외에도 Router의 스크롤 위치, SPA 새로고침, Weather 화면의 온도 토글 때문에 Navigation이 움직이는 문제 등 실제로 사용하면서 발견한 부분들을 계속 수정했다.

### 5. 학습 과정도 같이 남김

완성된 서비스만 남기지 않고 수업에서 작성했던 Vue 예제들을 `Vue Lab`에 모았다.

[Vue Lab 바로가기](https://skala-vue-nine-xi.vercel.app/practice)

기본 문법부터 Composition API, Watch, Component, Slot, Pinia, Axios, Element Plus까지 실제 실행하면서 확인할 수 있다.

---

## 주요 기능

### 산 정보 검색

산림청 산 정보 조회 API를 사용한다.

- 산 이름 / 높이 / 소재지
- 100대 명산 선정 이유
- 추천 산행 코스
- 대중교통
- 산 소개 및 상세 정보

검색 결과에서는 검색어와 정확히 일치하는 산을 우선해서 보여준다.

### 날씨와 대기질

산 소재지를 대표 기상 지역에 연결한 뒤 OpenWeatherMap에서 현재 날씨를 조회한다.

날씨 응답에서 얻은 좌표를 다시 이용해 대기질까지 조회한다.

> 산 정상의 정밀 관측값이 아니라 소재지 기반 대표 지역 정보다.

### Hiking Condition

기온, 습도, 풍속, 기상 상태, 가시거리와 AQI를 조합해 현재 산행 환경을 `0 ~ 100` 점수로 표시한다.

공식 산악 안전 지수가 아니라 여러 환경 데이터를 빠르게 비교하기 위해 만든 프로젝트 내부의 참고 점수다.

---

## 수업 내용 적용

| 학습 내용                    | 적용                               |
| ---------------------------- | ---------------------------------- |
| Vue 기본 문법                | Vue Lab 및 서비스 화면             |
| Composition API              | `ref`, `computed` 등 상태 처리     |
| Component                    | 검색, 날씨, 설정 UI 분리           |
| Vue Router                   | Welcome / 검색 / 상세 / 날씨 / Lab |
| Pinia                        | 산, 날씨, 사용자 설정 상태         |
| Axios                        | 산림청 / OpenWeatherMap 요청       |
| Element Plus                 | Input, Card, Tag, Slider, Progress |
| Props / Emits / Slot / Watch | Vue Lab 실습                       |

새로운 프레임워크를 추가하기보다는 수업에서 배운 기능들을 실제 서비스 안에서 연결하는 데 집중했다.

---

## 프로젝트 구조

```text
src/
├── components/
│   ├── exercise/
│   └── practices/
├── router/
├── services/
│   ├── mountainApi.js
│   └── weatherApi.js
├── stores/
│   ├── mountainStore.js
│   ├── weatherStore.js
│   └── configStore.js
├── utils/
│   ├── activityInsight.js
│   ├── hikingInsight.js
│   └── mountainWeather.js
├── views/
├── App.vue
└── main.js
```

API 요청은 `services`, 상태는 `stores`, 계산이나 매핑 로직은 `utils`로 나눴다.

초기 Weather 실습 파일 일부는 이 Repository가 수업 학습 기록이기도 해서 그대로 남겨두었다.

---

## 실행

```bash
npm install
npm run dev
```

`.env.example`을 참고해 `.env.local`을 만든다.

```dotenv
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
VITE_FOREST_API_KEY=YOUR_FOREST_API_KEY
```

실제 API Key는 Git에 포함하지 않는다.

최종 확인:

```bash
npm run lint
npm run build
```

---

## 사용 기술

```text
Vue 3
Vue Router
Pinia
Axios
Element Plus
Vite

산림청 공공데이터
OpenWeatherMap API
Vercel
```

---

## 마무리

처음에는 Component, Router, Pinia, Axios를 각각 따로 실습했지만 하나의 서비스를 만들면서 이 기능들이 왜 필요한지 훨씬 명확하게 볼 수 있었다.

특히 기존 Weather 실습을 버리지 않고 산 정보, 기상, 대기질까지 하나의 흐름으로 확장해본 것이 이번 프로젝트에서 가장 크게 남은 부분이다.
