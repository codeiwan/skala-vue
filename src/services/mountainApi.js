import axios from 'axios'

const API_KEY = import.meta.env.VITE_FOREST_API_KEY

const mountainApi = axios.create({
  baseURL: 'https://apis.data.go.kr/1400000/trailInfoService',
  timeout: 10000,
})

function validateApiKey() {
  if (!API_KEY) {
    throw new Error('산림청 API Key가 설정되지 않았습니다. .env.local을 확인하세요.')
  }
}

function getXmlText(element, tagName) {
  return element.querySelector(tagName)?.textContent?.trim() || ''
}

function decodeHtmlText(value) {
  if (!value) return ''

  const textarea = document.createElement('textarea')
  textarea.innerHTML = value

  const decoded = textarea.value
    .replace(/<BR\s*\/?>/gi, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return decoded
}

function parseMountainItem(item) {
  return {
    id: getXmlText(item, 'mntnid'),
    name: getXmlText(item, 'mntnnm'),
    height: Number(getXmlText(item, 'mntninfohght')) || null,
    location: getXmlText(item, 'mntninfopoflc'),
    subtitle: getXmlText(item, 'mntnsbttlinfo'),
    description: decodeHtmlText(getXmlText(item, 'mntninfodscrt')),
    detail: decodeHtmlText(getXmlText(item, 'mntninfodtlinfocont')),
    hikingPoint: decodeHtmlText(getXmlText(item, 'hkngpntdscrt')),
    selectionReason: decodeHtmlText(getXmlText(item, 'hndfmsmtnslctnrson')),
    courses: decodeHtmlText(getXmlText(item, 'crcmrsghtnginfoetcdscrt')),
    transportation: decodeHtmlText(getXmlText(item, 'pbtrninfodscrt')),
    imageUrl: getXmlText(item, 'mntnattchimageseq'),
    mapImageUrl: getXmlText(item, 'hndfmsmtnmapimageseq'),
  }
}

function parseMountainResponse(xmlString) {
  const parser = new DOMParser()
  const xmlDocument = parser.parseFromString(xmlString, 'application/xml')
  const parserError = xmlDocument.querySelector('parsererror')

  if (parserError) {
    throw new Error('산림청 API의 XML 응답을 해석하지 못했습니다.')
  }

  const resultCode =
    getXmlText(xmlDocument, 'resultCode') || getXmlText(xmlDocument, 'returnReasonCode')
  const resultMessage = getXmlText(xmlDocument, 'resultMsg') || getXmlText(xmlDocument, 'errMsg')

  if (resultCode && resultCode !== '00') {
    throw new Error(resultMessage || `산림청 API 오류 (${resultCode})`)
  }

  const items = [...xmlDocument.querySelectorAll('body > items > item')]
  const totalCount = Number(getXmlText(xmlDocument, 'totalCount'))

  return {
    mountains: items.map(parseMountainItem),
    totalCount,
  }
}

export async function searchMountains(mountainName) {
  validateApiKey()

  const keyword = mountainName.trim()

  if (!keyword) {
    return {
      mountains: [],
      totalCount: 0,
    }
  }

  const response = await mountainApi.get('/getforeststoryservice', {
    params: {
      ServiceKey: API_KEY,
      mntnNm: keyword,
      numOfRows: 10,
      pageNo: 1,
    },
    responseType: 'text',
  })

  return parseMountainResponse(response.data)
}

export function getMountainErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `산림청 API 요청에 실패했습니다. (${error.response.status})`
    }

    if (error.request) {
      return '산림청 API에서 응답을 받지 못했습니다. 브라우저 CORS 정책도 확인하세요.'
    }
  }

  return error.message || '산 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.'
}
