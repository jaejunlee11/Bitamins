// src/api/consultationAPI.ts
import axiosInstance from 'api/axiosInstance'

export const fetchConsultations = async (
  page: number,
  size: number,
  type: string
) => {
  try {
    const response = await axiosInstance.get('/consultations', {
      params: { page, size, type },
    })
    console.log('API Response:', response.data) // API 응답 데이터 확인
    return response.data
  } catch (error) {
    console.error('Error fetching consultations:', error)
    throw error
  }
}

export default {
  fetchConsultations,
}
