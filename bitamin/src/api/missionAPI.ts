import axiosInstance from './axiosInstance'

const BASE_URL = 'https://i11b105.p.ssafy.io/api'

// 선택한 날짜의 미션 기록 가져오기
export const fetchMissionsByDate = async (completeDate: string) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/missions/completed/${completeDate}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching missions:', error)
    throw error
  }
}

// 선택한 날짜의 녹음 기록 가져오기
export const fetchRecordedPhrasesByDate = async (saveDate: string) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/missions/phrases/recorded/${saveDate}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching recorded phrases:', error)
    throw error
  }
}

// 해당 월의 미션이 기록된 날짜 목록
export const fetchMissionDatesByMonth = async (date: string) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/missions/month/${date}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching mission dates:', error)
    throw error
  }
}

// 미션 등록
export const submitMission = async (missionData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/missions`,
      missionData
    )
    return response.data
  } catch (error) {
    console.error('Error submitting mission:', error)
    throw error
  }
}

// 오늘의 미션 조회
export const fetchTodayMission = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions`)
    return response.data
  } catch (error) {
    console.error('Error fetching todays mission:', error)
    throw error
  }
}
