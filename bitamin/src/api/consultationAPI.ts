import axiosInstance from 'api/axiosInstance'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  RoomData,
  JoinConsultation,
  ChatGPTRequest,
  ChatGPTResponse,
  Message,
  JoinData,
} from 'ts/consultationType'

// 상담 목록을 가져오는 함수
export const fetchConsultations = async (roomSearch: RoomSearch) => {
  try {
    const response = await axiosInstance.get<ConsultationList>(
      '/consultations',
      {
        params: {
          page: roomSearch.page,
          size: roomSearch.size,
          type: roomSearch.type,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching consultations:', error)
    throw error
  }
}

// 방을 생성하는 함수
export const createRoom = async (roomData: RoomData) => {
  try {
    const response = await axiosInstance.post<Consultation>(
      '/consultations',
      roomData
    )
    return response.data
  } catch (error) {
    console.error('Error creating room:', error)
    throw error
  }
}

// 특정 방에 참여하는 함수
export const joinRoom = async (joinData: JoinData) => {
  try {
    const response = await axiosInstance.post<JoinConsultation>(
      '/consultations/participants',
      joinData
    )
    return response.data
  } catch (error) {
    console.error('Error joining room:', error)
    throw error
  }
}

// 랜덤 방에 참여하는 함수
export const joinRandomRoom = async (type: string) => {
  try {
    const response = await axiosInstance.post<JoinConsultation>(
      '/consultations/random-participants',
      { type }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching random participants:', error)
    throw error
  }
}

// ChatGPT 메시지를 보내는 함수
export const sendChatGPTMessage = async (
  userId: string,
  content: string,
  category: string,
  previousMessages: Message[]
) => {
  try {
    const requestData: ChatGPTRequest = {
      gptCompletions: {
        [userId]: {
          messages: [...previousMessages, { role: 'user', content }],
        },
      },
    }

    const response = await axiosInstance.post<ChatGPTResponse>(
      `/consultations/moderators1/${category}`,
      requestData
    )

    return response.data
  } catch (error) {
    console.error('Error sending message to ChatGPT:', error)
    throw error
  }
}

// 상담을 떠나는 함수
export const leaveConsultation = async (consultationId: number) => {
  try {
    const response = await axiosInstance.delete(
      `consultations/${consultationId}`
    )
    return response
  } catch (error) {
    console.error('Error Leaving Consultation', error)
    throw error
  }
}
