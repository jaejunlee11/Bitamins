import { useEffect, useState } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance'
import useAuthStore from 'store/useAuthStore'
import { useCookies } from 'react-cookie'
import useUserStore from 'store/useUserStore'
import { getPhrases } from '@/api/phraseAPI'
import styles from 'styles/main/MainPage.module.css'
import mainImg from 'assets/image/mainImg.png'
import recordStop from '*.png'
import recordPlay from '*.png'
import recordStart from '*.png'
import recordAgain from '*.png'
import recordSave from '*.png'
import recordBackGroundImg from '*.png'

const ExLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phraseContent, setPhraseContent] = useState('') // phraseContent 상태 추가
  const [, setCookie] = useCookies(['refreshToken'])
  const setAuthAccessToken = useAuthStore((state) => state.setAccessToken)
  const setAuthRefreshToken = useAuthStore((state) => state.setRefreshToken)
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        const data = await getPhrases()
        setPhraseContent(data.phrase)
      } catch (error) {
        console.error('Error fetching the phrase:', error)
      }
    }

    fetchPhrase()
  }, []) // 컴포넌트가 마운트될 때 한번만 호출

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

      console.log('Before fetchUser')
      const data = await fetchUser()
      console.log('Fetched User Data:', data)

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
      <div className={styles.innerSection}>
        <img className={styles.mainImg} alt="Main Image" src={mainImg} />
        <div className={styles.inner}>
          <div className={styles.div3}>
            <p className={styles.p}>{phraseContent}</p>
          </div>
        </div>
      </div>
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
