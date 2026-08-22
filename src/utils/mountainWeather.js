const REGION_WEATHER_MAP = [
  { keywords: ['서울특별시', '서울'], cityId: 'city_01', label: '서울' },
  { keywords: ['경기도 수원시', '수원시'], cityId: 'city_02', label: '수원' },
  { keywords: ['인천광역시', '인천'], cityId: 'city_03', label: '인천' },
  {
    keywords: ['강원특별자치도 춘천시', '강원도 춘천시', '춘천시'],
    cityId: 'city_04',
    label: '춘천',
  },
  {
    keywords: ['강원특별자치도 강릉시', '강원도 강릉시', '강릉시'],
    cityId: 'city_05',
    label: '강릉',
  },
  { keywords: ['대전광역시', '대전'], cityId: 'city_06', label: '대전' },
  { keywords: ['충청북도 청주시', '청주시'], cityId: 'city_07', label: '청주' },
  { keywords: ['광주광역시', '광주'], cityId: 'city_08', label: '광주' },
  {
    keywords: ['전북특별자치도 전주시', '전라북도 전주시', '전주시'],
    cityId: 'city_09',
    label: '전주',
  },
  { keywords: ['전라남도 여수시', '여수시'], cityId: 'city_10', label: '여수' },
  { keywords: ['대구광역시', '대구'], cityId: 'city_11', label: '대구' },
  { keywords: ['부산광역시', '부산'], cityId: 'city_12', label: '부산' },
  { keywords: ['울산광역시', '울산'], cityId: 'city_13', label: '울산' },
  { keywords: ['경상남도 창원시', '창원시'], cityId: 'city_14', label: '창원' },
  { keywords: ['제주특별자치도', '제주도', '제주시'], cityId: 'city_15', label: '제주' },
]

const PROVINCE_FALLBACK_MAP = [
  { keywords: ['경기도'], cityId: 'city_02', label: '수원' },
  { keywords: ['강원특별자치도', '강원도'], cityId: 'city_04', label: '춘천' },
  { keywords: ['충청북도'], cityId: 'city_07', label: '청주' },
  { keywords: ['충청남도'], cityId: 'city_06', label: '대전' },
  { keywords: ['전북특별자치도', '전라북도'], cityId: 'city_09', label: '전주' },
  { keywords: ['전라남도'], cityId: 'city_08', label: '광주' },
  { keywords: ['경상북도'], cityId: 'city_11', label: '대구' },
  { keywords: ['경상남도'], cityId: 'city_14', label: '창원' },
]

function findRegion(location, mappings) {
  return mappings.find((mapping) => mapping.keywords.some((keyword) => location.includes(keyword)))
}

export function resolveMountainWeatherRegion(location) {
  if (!location) return null

  const exactRegion = findRegion(location, REGION_WEATHER_MAP)
  if (exactRegion) return exactRegion

  return findRegion(location, PROVINCE_FALLBACK_MAP) || null
}
