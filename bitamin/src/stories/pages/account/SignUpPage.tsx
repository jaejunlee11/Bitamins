import React, { useState } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance' // 경로 수정
import useAuthStore from 'store/useAuthStore' // 경로 수정
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import styles from 'styles/account/SignUpPage.module.css' // 스타일 경로

const SignUpPage: React.FC = () => {
  const [signupForm, setSignupForm] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    birthday: '',
    sidoName: '',
    gugunName: '',
    dongName: '',
    profileImage: null, // 파일은 null로 초기화
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddress, setShowAddress] = useState(false)
  const [, setCookie] = useCookies(['refreshToken'])
  const navigate = useNavigate()

  const {
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
    clearAuth,
  } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'profileImage' && files) {
      setSignupForm({
        ...signupForm,
        profileImage: files[0],
      })
    } else {
      setSignupForm({
        ...signupForm,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 비밀번호 확인
    if (signupForm.password !== signupForm.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    const formData = new FormData()
    formData.append('email', signupForm.email)
    formData.append('name', signupForm.name)
    formData.append('nickname', signupForm.nickname)
    formData.append('password', signupForm.password)
    formData.append('birthday', signupForm.birthday)
    formData.append('sidoName', signupForm.sidoName)
    formData.append('gugunName', signupForm.gugunName)
    formData.append('dongName', signupForm.dongName)
    if (signupForm.profileImage) {
      formData.append('profileImage', signupForm.profileImage)
    }
    // FormData의 모든 값을 출력하여 확인합니다.
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    try {
      console.log('Sign-up request data:', Array.from(formData.entries())) // 요청 데이터 확인
      const response = await axiosInstance.post(
        'https://i11b105.p.ssafy.io/api/members/register',
        formData
      )
      console.log('Server response:', response.data) // 서버 응답 확인

      const { accessToken, refreshToken } = response.data

      setAccessToken(accessToken) // axiosInstance에 accessToken 설정
      setAuthAccessToken(accessToken) // zustand 상태 관리에 accessToken 설정
      setAuthRefreshToken(refreshToken) // zustand 상태 관리에 refreshToken 설정
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict', // 또는 'lax' 또는 'none'으로 설정
      })

      setSuccess('회원가입이 성공적으로 완료되었습니다.')
      navigate('/login') // 회원가입 성공 시 login 페이지로 이동
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '회원가입 실패'
      setError(errorMessage)
      console.error('Signup error:', error) // 오류 로그 출력
      console.log('Error response:', error.response) // 상세 오류 응답 출력
    }
  }

  const toggleAddress = () => {
    setShowAddress(!showAddress)
  }

  return (
    <div className={styles.div}>
      <div className={styles.div1}>
        <b className={styles.b}>중복확인</b>
      </div>
      <b className={styles.b1}>사용 가능한 닉네임입니다.</b>
      <div className={styles.instanceParent}>
        <div className={styles.rectangleWrapper}>
          <div className={styles.instanceChild} />
        </div>
        <div className={styles.frameWrapper}>
          <div className={styles.groupParent}>
            <div className={styles.frameContainer}>
              <div className={styles.parent}>
                <div className={styles.div2}>회원가입</div>
                <b className={styles.bitamin}>
                  BItAMin에 오신 것을 환영합니다.
                </b>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.groupDiv}>
                <div className={styles.frameDiv}>
                  <div className={styles.groupContainer}>
                    <div className={styles.frameWrapper1}>
                      <div className={styles.groupParent1}>
                        <div className={styles.component78Parent}>
                          <div className={styles.component78}>
                            <div className={styles.component78Child} />
                            <div className={styles.ellipseParent}>
                              <div className={styles.frameChild} />
                              <img
                                className={styles.intersectIcon}
                                alt=""
                                src="Intersect.svg"
                              />
                              <input
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleChange}
                                className={styles.inputFile}
                              />
                            </div>
                          </div>
                          <div className={styles.iconWrapper}>
                            <img
                              className={styles.icon}
                              alt=""
                              src="Icon.svg"
                            />
                          </div>
                        </div>
                        <div className={styles.frameWrapper2}>
                          <div className={styles.frameWrapper3}>
                            <div className={styles.component70Parent}>
                              <div className={styles.component70}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceItem} />
                                  </div>
                                  <div className={styles.component69}>
                                    <img
                                      className={styles.checkBrokenIcon}
                                      alt=""
                                      src="check-broken.svg"
                                    />
                                    <input
                                      type="email"
                                      name="email"
                                      value={signupForm.email}
                                      onChange={handleChange}
                                      className={styles.input}
                                      placeholder="이메일"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={styles.component70}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceInner} />
                                  </div>
                                  <div className={styles.frameWrapper4}>
                                    <div className={styles.group}>
                                      <input
                                        type="text"
                                        name="name"
                                        value={signupForm.name}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="이름"
                                        required
                                      />
                                      <img
                                        className={styles.checkBrokenIcon1}
                                        alt=""
                                        src="check-broken.svg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.component70}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceItem} />
                                  </div>
                                  <div className={styles.component69}>
                                    <div className={styles.group}>
                                      <input
                                        type="text"
                                        name="nickname"
                                        value={signupForm.nickname}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="닉네임"
                                        required
                                      />
                                      <img
                                        className={styles.checkBrokenIcon1}
                                        alt=""
                                        src="check-broken.svg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.component70}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceInner} />
                                  </div>
                                  <div className={styles.frameWrapper6}>
                                    <div className={styles.group}>
                                      <input
                                        type="password"
                                        name="password"
                                        value={signupForm.password}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="비밀번호"
                                        required
                                      />
                                      <img
                                        className={styles.checkBrokenIcon1}
                                        alt=""
                                        src="check-broken.svg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.component74}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceInner} />
                                  </div>
                                  <div className={styles.frameWrapper7}>
                                    <div className={styles.group}>
                                      <input
                                        type="password"
                                        name="passwordConfirm"
                                        value={signupForm.passwordConfirm}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="비밀번호 확인"
                                        required
                                      />
                                      <img
                                        className={styles.checkBrokenIcon1}
                                        alt=""
                                        src="check-broken.svg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.component74}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceInner} />
                                  </div>
                                  <div className={styles.frameWrapper7}>
                                    <div className={styles.group}>
                                      <input
                                        type="date"
                                        name="birthday"
                                        value={signupForm.birthday}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="생년월일"
                                        required
                                      />
                                      <img
                                        className={styles.checkBrokenIcon1}
                                        alt=""
                                        src="check-broken.svg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.component74}>
                                <div className={styles.instanceGroup}>
                                  <div className={styles.rectangleContainer}>
                                    <div className={styles.instanceInner} />
                                  </div>
                                  <div className={styles.parent4}>
                                    <button
                                      type="button"
                                      onClick={toggleAddress}
                                      className={styles.inputToggle}
                                    >
                                      {showAddress
                                        ? '주소 숨기기'
                                        : '주소 입력'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {showAddress && (
                                <>
                                  <div className={styles.component70}>
                                    <div className={styles.instanceGroup}>
                                      <div
                                        className={styles.rectangleContainer}
                                      >
                                        <div className={styles.instanceItem} />
                                      </div>
                                      <div className={styles.component69}>
                                        <div className={styles.group}>
                                          <input
                                            type="text"
                                            name="sidoName"
                                            value={signupForm.sidoName}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="시/도"
                                            required
                                          />
                                          <img
                                            className={styles.checkBrokenIcon1}
                                            alt=""
                                            src="check-broken.svg"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.component70}>
                                    <div className={styles.instanceGroup}>
                                      <div
                                        className={styles.rectangleContainer}
                                      >
                                        <div className={styles.instanceItem} />
                                      </div>
                                      <div className={styles.component69}>
                                        <div className={styles.group}>
                                          <input
                                            type="text"
                                            name="gugunName"
                                            value={signupForm.gugunName}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="군/구"
                                            required
                                          />
                                          <img
                                            className={styles.checkBrokenIcon1}
                                            alt=""
                                            src="check-broken.svg"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.component70}>
                                    <div className={styles.instanceGroup}>
                                      <div
                                        className={styles.rectangleContainer}
                                      >
                                        <div className={styles.instanceItem} />
                                      </div>
                                      <div className={styles.component69}>
                                        <div className={styles.group}>
                                          <input
                                            type="text"
                                            name="dongName"
                                            value={signupForm.dongName}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="동"
                                            required
                                          />
                                          <img
                                            className={styles.checkBrokenIcon1}
                                            alt=""
                                            src="check-broken.svg"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {error && (
                                <div className={styles.error}>{error}</div>
                              )}
                              {success && (
                                <div className={styles.success}>{success}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.component77Wrapper}>
                      <div className={styles.component77}>
                        <div className={styles.wrapper}>
                          <b className={styles.b}>닫기</b>
                        </div>
                        <button type="submit" className={styles.div3}>
                          <b className={styles.b}>가입</b>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
