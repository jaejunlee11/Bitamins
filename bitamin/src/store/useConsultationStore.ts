// src/store/useConsultationStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { fetchConsultations } from 'api/consultationAPI'

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

interface ConsultationState {
  consultations: Consultation[]
  totalPages: number
  page: number
  size: number
  totalElements: number
  fetchAndSetConsultations: (
    page: number,
    size: number,
    type: string
  ) => Promise<void>
}

const useConsultationStore = create<ConsultationState>()(
  persist(
    (set) => ({
      consultations: [],
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
    }),
    {
      name: 'consultation-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useConsultationStore
