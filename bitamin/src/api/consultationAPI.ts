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
    return response.data
  } catch (error) {
    console.error('Error fetching consultations:', error)
    throw error
  }
}

interface RoomData {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}

export const createRoom = async (roomData: RoomData) => {
  const response = await axiosInstance.post('/consultations', roomData)
  console.log('Create Room Response:', response.data)
  return response.data
}

interface JoinData {
  id: number
  isPrivated: boolean
  password: string | null
  startTime: string
  sessionId: string
}

export const joinRoom = async (joinData: JoinData) => {
  const response = await axiosInstance.post(
    '/consultations/participants',
    joinData
  )
  console.log('Join Room Response:', response.data)
  return response.data
}

export const joinRandomParticipants = async (type: string) => {
  console.log(type)
  try {
    const response = await axiosInstance.post(
      '/consultations/random-participants',
      { type }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching random participants:', error)
    throw error
  }
}

interface GPTMessage {
  role: string
  content: string
  category: string
}

export const sendChatGPTMessage = async (
  user: string,
  content: string,
  category: string
) => {
  try {
    const response = await axiosInstance.post(
      `/consultations/moderators1/${category}`,
      {
        gptCompletions: {
          [user]: {
            messages: [
              {
                role: 'user',
                content: content,
              },
            ],
          },
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error sending message to ChatGPT:', error)
    throw error
  }
}

export default {
  fetchConsultations,
  createRoom,
  joinRoom,
  joinRandomParticipants,
  sendChatGPTMessage,
}
