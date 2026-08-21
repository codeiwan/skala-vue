function clampScore(score) {
  return Math.max(0, Math.min(100, score))
}

export function createActivityInsight(weather, airQuality = null) {
  let score = 100

  const cautions = []

  // ======================================================
  // 기온
  // ======================================================

  if (weather.temp >= 32) {
    score -= 30
    cautions.push('폭염·탈수 주의')
  } else if (weather.temp >= 29) {
    score -= 18
    cautions.push('한낮 더위 주의')
  } else if (weather.temp >= 27) {
    score -= 8
  } else if (weather.temp <= 5) {
    score -= 30
    cautions.push('강한 추위 주의')
  } else if (weather.temp <= 10) {
    score -= 18
    cautions.push('낮은 기온 주의')
  }

  // ======================================================
  // 습도
  // ======================================================

  if (weather.humidity >= 85) {
    score -= 12
    cautions.push('높은 습도 주의')
  } else if (weather.humidity >= 75) {
    score -= 6
  }

  // ======================================================
  // 풍속
  // ======================================================

  if (weather.windSpeed >= 10) {
    score -= 20
    cautions.push('강풍 주의')
  } else if (weather.windSpeed >= 7) {
    score -= 10
    cautions.push('바람 주의')
  }

  // ======================================================
  // 날씨 상태
  // ======================================================

  if (weather.weatherMain === 'Thunderstorm') {
    score -= 40
    cautions.push('낙뢰·강수 주의')
  } else if (weather.weatherMain === 'Rain' || weather.weatherMain === 'Drizzle') {
    score -= 28
    cautions.push('우산 준비 권장')
  } else if (weather.weatherMain === 'Snow') {
    score -= 25
    cautions.push('적설·빙판 주의')
  }

  // ======================================================
  // OpenWeather Air Pollution API
  // ======================================================

  if (airQuality?.aqi >= 4) {
    score -= 25
    cautions.push('대기질 매우 나쁨')
  } else if (airQuality?.aqi === 3) {
    score -= 12
    cautions.push('대기질 주의')
  }

  score = clampScore(score)

  let activity

  if (score >= 80) {
    activity = '야외 활동에 매우 적합'
  } else if (score >= 65) {
    activity = '가벼운 야외 활동 가능'
  } else if (score >= 50) {
    activity = '야외 활동 시 주의'
  } else {
    activity = '실내 활동을 권장'
  }

  let recommendation

  if (
    weather.weatherMain === 'Rain' ||
    weather.weatherMain === 'Drizzle' ||
    weather.weatherMain === 'Thunderstorm'
  ) {
    recommendation = '실내 운동이나 실내 관광 추천'
  } else if (weather.temp >= 30) {
    recommendation = '해가 진 뒤 가벼운 활동 추천'
  } else if (score >= 80) {
    recommendation = '산책이나 야외 러닝 추천'
  } else if (score >= 65) {
    recommendation = '가벼운 산책 정도 추천'
  } else {
    recommendation = '무리하지 않는 실내 활동 추천'
  }

  const caution =
    cautions.length > 0 ? cautions.slice(0, 2).join(' · ') : '특별한 기상 주의사항 없음'

  return {
    activityScore: score,
    activity,
    recommendation,
    caution,
  }
}
