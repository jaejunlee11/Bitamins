import React, { useState, useEffect } from 'react'
import {
  registerUser,
  checkNickname,
  fetchSidoNames,
  fetchGugunNames,
  fetchDongNames,
} from '@/api/userAPI'
import useAuthStore from '@/store/useAuthStore' // 경로 수정
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
    image: null as File | null, // 파일은 null로 초기화
  })
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [, setCookie] = useCookies(['refreshToken'])
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 미리보기 URL 상태

  const [sidoNames, setSidoNames] = useState<string[]>([])
  const [gugunNames, setGugunNames] = useState<string[]>([])
  const [dongNames, setDongNames] = useState<string[]>([])

  const {
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
  } = useAuthStore()

  // 시/도 목록을 가져옴
  useEffect(() => {
    const loadSidoNames = async () => {
      try {
        const data = await fetchSidoNames()
        setSidoNames(data)
      } catch (error) {
        console.error('시/도 목록을 가져오는 중 오류 발생:', error)
      }
    }

    loadSidoNames()
  }, [])

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target
    if (name === 'image' && files && files[0]) {
      const imageFile = files[0]
      setSignupForm({
        ...signupForm,
        image: imageFile,
      })
      const previewUrl = URL.createObjectURL(imageFile)
      setPreviewUrl(previewUrl) // 미리보기 URL을 상태에 저장
    } else {
      setSignupForm({
        ...signupForm,
        [name]: value,
      })

      if (name === 'nickname' && value) {
        try {
          const result = await checkNickname(value)
          setNicknameValid(result === 0) // 0이면 사용 가능, 1이면 중복
        } catch (error) {
          setNicknameValid(null)
          setError('닉네임 중복 확인 중 오류가 발생했습니다.')
        }
      }

      if (name === 'sidoName') {
        // 시/도를 선택하면 구/군 목록을 로드
        try {
          const data = await fetchGugunNames(value)
          setGugunNames(data)
          setSignupForm({
            ...signupForm,
            sidoName: value,
            gugunName: '',
            dongName: '',
          })
          setDongNames([]) // 구/군 선택 전 동 목록 초기화
        } catch (error) {
          console.error('구/군 목록을 가져오는 중 오류 발생:', error)
        }
      }

      if (name === 'gugunName') {
        // 구/군을 선택하면 동 목록을 로드
        try {
          const data = await fetchDongNames(signupForm.sidoName, value)
          setDongNames(data)
          setSignupForm({ ...signupForm, gugunName: value, dongName: '' })
        } catch (error) {
          console.error('동 목록을 가져오는 중 오류 발생:', error)
        }
      }
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
    if (nicknameValid === false) {
      setError('중복된 닉네임입니다. 다른 닉네임을 사용하세요.')
      return
    }

    try {
      const data = await registerUser(signupForm)

      const { accessToken, refreshToken } = data

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
                              <div>
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt="미리보기 이미지"
                                    className={styles.image}
                                  />
                                ) : (
                                  <div>이미지를 불러오는 중...</div>
                                )}
                              </div>
                              <input
                                type="file"
                                name="image"
                                accept=".jpg, .jpeg, .png"
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
                                      {nicknameValid === false && (
                                        <div className={styles.error}>
                                          닉네임이 이미 사용 중입니다.
                                        </div>
                                      )}
                                      {nicknameValid && (
                                        <div className={styles.success}>
                                          닉네임을 사용할 수 있습니다.
                                        </div>
                                      )}
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
                                  <div>
                                    <select
                                      name="sidoName"
                                      value={signupForm.sidoName}
                                      onChange={handleChange}
                                      className={styles.input}
                                      required
                                    >
                                      <option value="">시/도 선택</option>
                                      {sidoNames.map((sido) => (
                                        <option key={sido} value={sido}>
                                          {sido}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              {signupForm.sidoName && (
                                <div className={styles.component74}>
                                  <div className={styles.instanceGroup}>
                                    <div className={styles.rectangleContainer}>
                                      <div className={styles.instanceInner} />
                                    </div>
                                    <div>
                                      <select
                                        name="gugunName"
                                        value={signupForm.gugunName}
                                        onChange={handleChange}
                                        className={styles.input}
                                      >
                                        <option value="">구/군 선택</option>
                                        {gugunNames.map((gugun) => (
                                          <option key={gugun} value={gugun}>
                                            {gugun}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {signupForm.gugunName && (
                                <div className={styles.component74}>
                                  <div className={styles.instanceGroup}>
                                    <div className={styles.rectangleContainer}>
                                      <div className={styles.instanceInner} />
                                    </div>
                                    <div>
                                      <select
                                        name="dongName"
                                        value={signupForm.dongName}
                                        onChange={handleChange}
                                        className={styles.input}
                                      >
                                        <option value="">동 선택</option>
                                        {dongNames.map((dong) => (
                                          <option key={dong} value={dong}>
                                            {dong}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
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
