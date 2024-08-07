import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  clearAuth: () => void
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      username: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearAuth: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 사용할 스토리지 (기본값은 localStorage)
    }
  )
)

export default useAuthStore
