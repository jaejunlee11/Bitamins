import axiosInstance from './axiosInstance'

export const fetchComplaintList = async () => {
  try {
    console.log('Fetching complaints list...')
    const response = await axiosInstance.get('/complaints')
    console.log('Response received:', response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error('Response error data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    throw new Error('Failed to fetch ComplaintList')
  }
}

export const fetchComplaintDetail = async (id: number) => {
  try {
    console.log(`Fetching complaint detail for ID: ${id}`)
    const response = await axiosInstance.get(`/complaints/${id}`)
    console.log('Response received:', response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error('Response error data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    throw new Error('Failed to fetch ComplaintDetail')
  }
}

export const updateComplaintStopDate = async (id: number, stopDate: number) => {
  try {
    console.log(`Updating complaint stop date for ID: ${id} to ${stopDate}`)
    const response = await axiosInstance.patch(`/complaints/${id}/${stopDate}`)
    console.log('Update response received:', response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error('Response error data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    throw new Error('Failed to update ComplaintStopDate')
  }
}

// const axiosInstance = axios.create({
//   baseURL: 'https://your-api-base-url.com', // 실제 API의 base URL로 변경해주세요.
//   headers: {
//     'Content-Type': 'application/json',
//     // 필요한 경우 인증 토큰 등 추가 헤더 설정
//   },
// })
