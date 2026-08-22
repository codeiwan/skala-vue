function clampScore(score) {
  return Math.max(0, Math.min(100, score))
}

function createTemperatureAssessment(temp, warnings) {
  let penalty = 0

  if (temp >= 33) {
    penalty += 35
    warnings.push('기온이 매우 높아 온열질환에 주의하세요.')
  } else if (temp >= 30) {
    penalty += 25
    warnings.push('기온이 높아 충분한 수분 섭취가 필요합니다.')
  } else if (temp >= 27) {
    penalty += 10
    warnings.push('산행 중 더위와 체력 소모에 주의하세요.')
  } else if (temp <= 0) {
    penalty += 35
    warnings.push('기온이 매우 낮아 방한 장비가 필요합니다.')
  } else if (temp <= 5) {
    penalty += 20
    warnings.push('낮은 기온에 대비한 보온 의류가 필요합니다.')
  }

  return penalty
}

function createHumidityAssessment(humidity, warnings) {
  let penalty = 0

  if (humidity >= 90) {
    penalty += 15
    warnings.push('습도가 매우 높아 체력 소모가 커질 수 있습니다.')
  } else if (humidity >= 80) {
    penalty += 8
    warnings.push('습도가 높아 산행 중 불쾌감이 커질 수 있습니다.')
  }

  return penalty
}

function createWindAssessment(windSpeed, warnings) {
  let penalty = 0

  if (windSpeed >= 14) {
    penalty += 35
    warnings.push('강한 바람으로 능선과 정상 부근에서 주의가 필요합니다.')
  } else if (windSpeed >= 10) {
    penalty += 22
    warnings.push('바람이 강해 노출된 구간에서 주의하세요.')
  } else if (windSpeed >= 7) {
    penalty += 10
    warnings.push('다소 강한 바람이 예상됩니다.')
  }

  return penalty
}

function createWeatherAssessment(weatherMain, warnings) {
  let penalty = 0

  if (weatherMain === 'Thunderstorm') {
    penalty += 50
    warnings.push('뇌우가 예상되어 산행을 권장하지 않습니다.')
  } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    penalty += 30
    warnings.push('비로 인해 등산로가 미끄러울 수 있습니다.')
  } else if (weatherMain === 'Snow') {
    penalty += 35
    warnings.push('눈으로 인해 등산로 상태가 위험할 수 있습니다.')
  } else if (weatherMain === 'Mist' || weatherMain === 'Fog') {
    penalty += 20
    warnings.push('안개로 인해 시야 확보가 어려울 수 있습니다.')
  }

  return penalty
}

function createVisibilityAssessment(visibility, warnings) {
  if (visibility == null) return 0

  if (visibility < 2000) {
    warnings.push('가시거리가 짧아 길 찾기에 주의하세요.')
    return 15
  }

  if (visibility < 5000) {
    warnings.push('가시거리가 다소 제한적입니다.')
    return 7
  }

  return 0
}

function createAirQualityAssessment(airQuality, warnings) {
  if (!airQuality?.aqi) return 0

  if (airQuality.aqi === 5) {
    warnings.push('대기질이 매우 좋지 않아 장시간 야외 산행에 주의하세요.')
    return 30
  }

  if (airQuality.aqi === 4) {
    warnings.push('대기질이 좋지 않아 장시간 야외 활동에 주의하세요.')
    return 20
  }

  if (airQuality.aqi === 3) {
    warnings.push('대기질이 보통 수준이므로 민감한 경우 상태를 확인하세요.')
    return 10
  }

  return 0
}

function getHikingStatus(score) {
  if (score >= 85) {
    return {
      label: '산행하기 매우 좋은 환경',
      type: 'success',
    }
  }

  if (score >= 70) {
    return {
      label: '산행하기 좋은 환경',
      type: 'success',
    }
  }

  if (score >= 50) {
    return {
      label: '주의하며 산행 가능',
      type: 'warning',
    }
  }

  return {
    label: '산행을 권장하지 않음',
    type: 'danger',
  }
}

function getHikingRecommendation(score) {
  if (score >= 85) {
    return '기상 조건이 안정적입니다. 기본 산행 준비를 갖추고 안전하게 이용하세요.'
  }

  if (score >= 70) {
    return '대체로 산행하기 좋은 조건이지만 현지 기상 변화는 계속 확인하세요.'
  }

  if (score >= 50) {
    return '산행은 가능하지만 환경 조건을 고려해 짧고 안전한 코스를 선택하는 것이 좋습니다.'
  }

  return '현재 환경에서는 산행을 미루거나 다른 일정을 고려하는 것이 좋습니다.'
}

export function createHikingInsight(weather, airQuality = null) {
  if (!weather) return null

  const warnings = []
  let score = 100

  score -= createTemperatureAssessment(weather.temp, warnings)
  score -= createHumidityAssessment(weather.humidity, warnings)
  score -= createWindAssessment(weather.windSpeed, warnings)
  score -= createWeatherAssessment(weather.weatherMain, warnings)
  score -= createVisibilityAssessment(weather.visibility, warnings)
  score -= createAirQualityAssessment(airQuality, warnings)

  const finalScore = clampScore(score)
  const status = getHikingStatus(finalScore)

  return {
    score: finalScore,
    label: status.label,
    type: status.type,
    recommendation: getHikingRecommendation(finalScore),
    warnings: warnings.slice(0, 4),
  }
}
