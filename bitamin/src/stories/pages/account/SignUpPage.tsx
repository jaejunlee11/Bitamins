import { useState, useCallback } from 'react'
import styles from 'styles/account/SignUpPage.module.css'

const SignUpPage: React.FC = () => {
  const [isFrameOpen, setFrameOpen] = useState(false)

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
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
                                    <b className={styles.b2}>이메일</b>
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
                                      <b className={styles.b}>이름</b>
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
                                      <b className={styles.b}>닉네임</b>
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
                                      <b className={styles.b}>비밀번호</b>
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
                                      <b className={styles.b}>비밀번호 확인</b>
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
                                  <div className={styles.frameWrapper6}>
                                    <div className={styles.group}>
                                      <b className={styles.b}>생년월일</b>
                                      <img
                                        className={styles.checkBrokenIcon1}
                                        alt=""
                                        src="check-broken.svg"
                                      />
                                    </div>
                                  </div>
                                  <div className={styles.component68}>
                                    <div className={styles.instanceInner} />
                                    <div className={styles.component67}>
                                      <img
                                        className={styles.calendarCheckIcon}
                                        alt=""
                                        src="calendar-check.svg"
                                      />
                                      <b className={styles.b2}>
                                        생년월일을 입력해주세요
                                      </b>
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
                                    <b className={styles.b}>주소</b>
                                    <img
                                      className={styles.checkBrokenIcon1}
                                      alt=""
                                      src="check-broken.svg"
                                    />
                                  </div>
                                </div>
                              </div>
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
                        <div className={styles.div3} onClick={openFrame}>
                          <b className={styles.b}>가입</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.bitamin1} onClick={onBItAMinTextClick}>
            BItAMin
          </div>
          <div className={styles.parent5}>
            <div className={styles.div4}>
              <div className={styles.frame}>
                <div className={styles.b}>상담</div>
              </div>
              <div className={styles.child} />
            </div>
            <div className={styles.div4}>
              <div className={styles.frame}>
                <div className={styles.b}>미션</div>
              </div>
              <div className={styles.child} />
            </div>
            <div className={styles.div4}>
              <div className={styles.parent6}>
                <div className={styles.b}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child} />
            </div>
          </div>
          <div className={styles.div10}>
            <div className={styles.div11}>로그인</div>
            <div className={styles.div12}>/</div>
            <div className={styles.b}>회원가입</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUpPage
