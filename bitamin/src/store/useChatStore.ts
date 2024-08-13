import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sendChatGPTMessage } from 'api/consultationAPI'
import { ChatLog, Message } from 'ts/consultationType'

interface ChatState {
  chatLog: ChatLog
  sttTexts: { [user: string]: string[] } // STT 텍스트를 저장할 상태 추가
  sendMessage: (
    user: string,
    content: string,
    category: string
  ) => Promise<void>
  resetChatLog: () => void
  saveSttText: (user: string, text: string) => void // STT 텍스트 저장 메서드 추가
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatLog: {},
      sttTexts: {}, // 초기 STT 텍스트 상태

      sendMessage: async (user: string, content: string, category: string) => {
        try {
          const currentChatLog = get().chatLog

          const userMessages: Message[] = currentChatLog[user]?.messages || []

          const userMessage: Message = {
            role: 'user',
            content,
          }

          // GPT API로 메시지 전송
          const response = await sendChatGPTMessage(
            user,
            content,
            category,
            userMessages
          )

          const assistantMessage: Message = {
            role: 'assistant',
            content: response.gptResponses[user].content,
          }

          // 채팅 로그 업데이트
          set((state) => ({
            chatLog: {
              ...state.chatLog,
              [user]: {
                userId: user,
                messages: [...userMessages, userMessage, assistantMessage],
              },
            },
          }))

          // TTS 기능으로 응답 음성 재생
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              assistantMessage.content
            )
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

      saveSttText: (user: string, text: string) => {
        set((state) => ({
          sttTexts: {
            ...state.sttTexts,
            [user]: [...(state.sttTexts[user] || []), text],
          },
        }))

        // 텍스트가 저장될 때마다 콘솔에 출력
        console.log(`STT Text saved for ${user}: ${text}`)
      },
    }),
    {
      name: 'chat-log-storage',
    }
  )
)
