import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sendChatGPTMessage } from 'api/consultationAPI'
import { ChatLog, Message } from 'ts/consultationType'

interface ChatState {
  chatLog: ChatLog
  sttTexts: { [userId: string]: string[] } // STT 텍스트를 저장할 상태 추가
  sendMessage: (
    userId: string,
    content: string,
    category: string
  ) => Promise<void>
  resetChatLog: () => void
  saveSttText: (userId: string, text: string) => void // STT 텍스트 저장 메서드 추가
  processSttAndSendMessage: (userId: string, category: string) => Promise<void>
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatLog: {},
      sttTexts: {},

      sendMessage: async (
        userId: string,
        content: string,
        category: string
      ) => {
        try {
          const currentChatLog = get().chatLog
          const userMessages: Message[] = currentChatLog[userId]?.messages || []

          const userMessage: Message = {
            role: 'user',
            content,
          }

          // GPT API로 메시지 전송
          const response = await sendChatGPTMessage(
            userId,
            content,
            category,
            userMessages
          )

          const assistantMessage: Message = {
            role: 'assistant',
            content: response.gptResponses[userId].content,
          }

          // 채팅 로그 업데이트
          set((state) => ({
            chatLog: {
              ...state.chatLog,
              [userId]: {
                userId: userId,
                messages: [...userMessages, userMessage, assistantMessage],
              },
            },
          }))

          // TTS 기능으로 응답 음성 재생
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              assistantMessage.content
            )
            utterance.lang = 'ko-KR' // 한국어 설정
            speechSynthesis.speak(utterance)
          } else {
            console.error('TTS를 지원하지 않는 브라우저입니다.')
          }
        } catch (error) {
          console.error('Failed to send message to ChatGPT:', error)
          throw error
        }
      },

      resetChatLog: () => {
        set({ chatLog: {} })
      },

      saveSttText: (userId: string, text: string) => {
        if (!text || typeof text !== 'string') {
          console.error('Invalid STT text received:', text)
          return
        }

        set((state) => {
          const existingTexts = state.sttTexts[userId] || []
          const updatedTexts = [...existingTexts, text]

          console.log(`Updating STT Texts for ${userId}:`, updatedTexts)

          return {
            sttTexts: {
              ...state.sttTexts,
              [userId]: updatedTexts,
            },
          }
        })

        console.log(`STT Text saved for ${userId}: ${text}`)
      },

      // STT 텍스트를 처리하고 메시지를 전송하는 함수
      processSttAndSendMessage: async (userId: string, category: string) => {
        const sttTexts = get().sttTexts[userId] || []
        const content = sttTexts.join(' ')

        // STT 텍스트를 기반으로 메시지 전송
        await get().sendMessage(userId, content, category)

        // STT 텍스트 초기화
        set((state) => ({
          sttTexts: {
            ...state.sttTexts,
            [userId]: [],
          },
        }))
      },
    }),
    {
      name: 'chat-log-storage',
    }
  )
)
