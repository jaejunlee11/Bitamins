import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  CreateConsultation,
  JoinConsultation,
  ChatLog,
} from 'ts/consultationType'
import {
  fetchConsultations,
  joinRoom,
  joinRandomRoom,
  createRoom,
  sendChatGPTMessage,
} from 'api/consultationAPI'

// Consultation List 상태 관리
interface ConsultationState {
  ConsultationList: ConsultationList | null
  fetchConsultations: (roomSearch: RoomSearch) => Promise<void>
}

export const fetchConsultationList = create<ConsultationState>()(
  persist(
    (set) => ({
      ConsultationList: null,

      fetchConsultations: async (roomSearch: RoomSearch) => {
        try {
          const data = await fetchConsultations(roomSearch)
          set({
            ConsultationList: {
              consultationList: data.consultationList, // 여기서 ConsultationList를 반환합니다.
              page: data.page,
              size: data.size,
              totalElements: data.totalElements,
              totalPages: data.totalPages,
            },
          })
        } catch (error) {
          console.error('Failed to fetch consultations:', error)
        }
      },
    }),
    {
      name: 'consultationList-storage',
    }
  )
)

// 방 참여 상태 관리
type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
> & {
  password: string
}

interface JoinConsultationState {
  joinconsultation: JoinConsultation | null
  joinRoom: (joinData: JoinData) => Promise<JoinConsultation>
  resetConsultation: () => void
  setJoinConsultation: (consultation: JoinConsultation | null) => void
}

export const joinConsultation = create<JoinConsultationState>()(
  persist(
    (set) => ({
      joinconsultation: null,

      joinRoom: async (joinData: JoinData) => {
        try {
          const consultation = await joinRoom(joinData)

          // 받은 consultation 데이터를 zustand 스토어에 저장
          set({ joinconsultation: consultation })

          // consultation 데이터를 반환하여 사용 가능하게 함
          return consultation
        } catch (error) {
          console.error('Failed to join room:', error)
          throw error
        }
      },

      resetConsultation: () => {
        set({ joinconsultation: null })
      },

      setJoinConsultation: (consultation: JoinConsultation | null) => {
        set({ joinconsultation: consultation })
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)

// 방 생성 상태 관리
interface CreateRoomState {
  createdRoom: Consultation | null
  createRoom: (
    roomData: CreateConsultation
  ) => Promise<Consultation | undefined>
  resetCreatedRoom: () => void
}

export const useCreateRoom = create<CreateRoomState>()(
  persist(
    (set) => ({
      createdRoom: null,

      createRoom: async (roomData: CreateConsultation) => {
        try {
          const createdRoom = await createRoom(roomData)
          set({ createdRoom })
          return createdRoom
        } catch (error) {
          console.error('Failed to create room:', error)
          return undefined
        }
      },

      resetCreatedRoom: () => {
        set({ createdRoom: null })
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)

// 랜덤 방 참여 상태 관리
interface joinRandomRoomState {
  type: string | null
  consultation: JoinConsultation | null
  joinRandomRoom: (type: string) => Promise<JoinConsultation>
}

export const useJoinRandomRoom = create<joinRandomRoomState>()(
  persist(
    (set) => ({
      type: null,
      consultation: null,
      joinRandomRoom: async (type: string) => {
        try {
          const response = await joinRandomRoom(type)
          set({ consultation: response })
          return response
        } catch (error) {
          console.error('Failed to join room:', error)
          throw error
        }
      },
    }),
    { name: 'consultation-storage' }
  )
)

// GPT 메시지 상태 관리
interface ChatState {
  chatLog: ChatLog
  sendMessage: (
    user: string,
    content: string,
    category: string
  ) => Promise<void>
  resetChatLog: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatLog: {},

      sendMessage: async (user: string, content: string, category: string) => {
        try {
          const currentChatLog = get().chatLog

          const userMessages = currentChatLog[user]?.messages || []

          const userMessage = {
            role: 'user' as const,
            content,
          }

          const response = await sendChatGPTMessage(
            user,
            content,
            category,
            userMessages
          )

          const assistantMessage = {
            role: 'assistant' as const,
            content: response.gptResponses[user].content,
          }

          set((state) => ({
            chatLog: {
              ...state.chatLog,
              [user]: {
                userId: user,
                messages: [...userMessages, userMessage, assistantMessage],
              },
            },
          }))
        } catch (error) {
          console.error('Failed to send message to ChatGPT:', error)
          throw error
        }
      },

      resetChatLog: () => {
        set({ chatLog: {} })
      },
    }),
    {
      name: 'chat-log-storage',
    }
  )
)
