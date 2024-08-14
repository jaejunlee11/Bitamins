import { useState } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance'
import useAuthStore from 'store/useAuthStore'
import { useCookies } from 'react-cookie'
import useUserStore from 'store/useUserStore' // useUserStore 임포트

const ExLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setCookie] = useCookies(['refreshToken']) // `cookies` 대신 `_`를 사용
  const setAuthAccessToken = useAuthStore((state) => state.setAccessToken)
  const setAuthRefreshToken = useAuthStore((state) => state.setRefreshToken)
  const fetchUser = useUserStore((state) => state.fetchUser) // fetchUser 가져오기

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      const { accessToken, refreshToken } = response.data
      setAccessToken(accessToken)
      setAuthAccessToken(accessToken)
      setAuthRefreshToken(refreshToken)
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict',
      })

      console.log('Before fetchUser') // 여기까지 도달했는지 확인
      const data = await fetchUser()
      console.log('Fetched User Data:', data) // 유저 데이터가 제대로 출력되는지 확인

      alert('Login successful!')
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      alert(`Login failed: ${errorMessage}`)
      console.error('Login error:', error)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default ExLogin
