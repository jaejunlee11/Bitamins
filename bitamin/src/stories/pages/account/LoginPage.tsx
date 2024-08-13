import { useState, useCallback } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance' // 경로 수정
import useAuthStore from 'store/useAuthStore' // 경로 수정
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import styles from 'styles/account/LoginPage.module.css'
import HeaderBeforeLogin from '@/stories/organisms/common/HeaderBeforeLogin'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setCookie] = useCookies(['refreshToken']) // `cookies` 대신 `_`를 사용
  const navigate = useNavigate()

  const {
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
  } = useAuthStore()

  // 이거 없애도 되려낭
  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  const handleLogin = async () => {
    try {
      console.log('Login request data:', { email, password })
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      const { accessToken, refreshToken } = response.data
      console.log('Server response:', response.data) // 서버 응답 확인
      console.log('Access Token:', accessToken) // 토큰 확인
      console.log('Refresh Token:', refreshToken)

      setAccessToken(accessToken) // axiosInstance에 accessToken 설정
      setAuthAccessToken(accessToken) // zustand 상태 관리에 accessToken 설정
      setAuthRefreshToken(refreshToken) // zustand 상태 관리에 refreshToken 설정

      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict', // 또는 'lax' 또는 'none'으로 설정
      })

      // 세션 스토리지에 인증 상태 저장
      sessionStorage.setItem('isAuthenticated', 'true')
      alert('Login successful!')
      navigate('/home')
    } catch (error: any) {
      console.error('Login error:', error.response || error.message)
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      alert(`Login failed: ${errorMessage}`)
    }
  }

  const handleSignUp = useCallback(() => {
    navigate('/signup')
  }, [navigate])
  return (
    <>
      <HeaderBeforeLogin />
      <div className={styles.div}>
        <div className={styles.backred} />
        <div className={styles.component66}>
          <div className={styles.component63}>
            <b className={styles.b}>로그인</b>
            <b className={styles.bitamin1}>BItAMin에 오신 것을 환영합니다.</b>
          </div>
          <div className={styles.component65}>
            <div className={styles.component65Child} />
            <div className={styles.component64}>
              <div className={styles.component61}>
                <div className={styles.component61Child} />
                {/* <p>이메일</p> */}
                <br />
                <br />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className={styles.div11}
                />
              </div>
              <div className={styles.component62}>
                <div className={styles.component61Child} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className={styles.div11}
                />
              </div>
              <div className={styles.component55} onClick={handleLogin}>
                <div className={styles.component55Child}>
                  <b className={styles.b1}>로그인</b>
                </div>
              </div>
              <div className={styles.component56} onClick={handleSignUp}>
                <div className={styles.component56Child}>
                  <b className={styles.b2}>회원가입</b>
                </div>
              </div>

              <div className={styles.component60}>
                <div className={styles.component60Child} />
                <div className={styles.component60Item} />
                <div className={styles.component58}>
                  <img
                    className={styles.reactIconssisinaver}
                    alt=""
                    src="react-icons/si/SiNaver.svg"
                  />
                  <div className={styles.div13}>네이버 로그인</div>
                </div>
                <div className={styles.component59}>
                  <img
                    className={styles.reactIconsfcfcgoogle}
                    alt=""
                    src="react-icons/fc/FcGoogle.svg"
                  />
                  <div className={styles.div13}>구글 로그인</div>
                </div>
                <div className={styles.component57}>
                  <img
                    className={styles.component57Child}
                    alt=""
                    src="Frame 1364.png"
                  />
                  <div className={styles.div15}>카카오 로그인</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
