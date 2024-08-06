import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { fetchConsultations, createRoom, joinRoom } from 'api/consultationAPI'

interface Consultation {
  id: number
  category: string
  title: string
  isPrivated: number
  startTime: string
  endTime: string
  currentParticipants: number
  sessionId: string
}

interface Participant {
  consultationId: number
  token: string
  id: number
  memberId: number
  nickname: string
  profileKey: string
  profileUrl: string
}

interface RoomData {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}

interface JoinData {
  id: number
  isPrivated: number
  password: string | null
  startTime: string
  sessionId: string
}

interface ConsultationState {
  consultations: Consultation[]
  participant: Participant | null
  roomData: RoomData | null
  joinData: JoinData | null
  totalPages: number
  page: number
  size: number
  totalElements: number
  fetchAndSetConsultations: (
    page: number,
    size: number,
    type: string
  ) => Promise<void>
  setParticipant: (participant: Participant) => void
  setRoomData: (roomData: RoomData) => void
  setJoinData: (joinData: JoinData) => void
}

const useConsultationStore = create<ConsultationState>()(
  persist(
    (set) => ({
      consultations: [],
      participant: null,
      roomData: null,
      joinData: null,
      totalPages: 0,
      page: 0,
      size: 10,
      totalElements: 0,
      fetchAndSetConsultations: async (
        page: number,
        size: number,
        type: string
      ) => {
        try {
          const data = await fetchConsultations(page, size, type)
          if (data && data.consultationList) {
            set({
              consultations: data.consultationList,
              totalPages: data.totalPages,
              page: data.page,
              size: data.size,
              totalElements: data.totalElements,
            })
          } else {
            console.error('Unexpected API response structure:', data)
            throw new Error('Unexpected API response structure')
          }
        } catch (error) {
          console.error('Failed to fetch consultations:', error)
          throw new Error('Failed to fetch consultations')
        }
      },
      setParticipant: (participant: Participant) => set({ participant }),
      setRoomData: (roomData: RoomData) => set({ roomData }),
      setJoinData: (joinData: JoinData) => set({ joinData }),
    }),
    {
      name: 'consultation-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useConsultationStore
