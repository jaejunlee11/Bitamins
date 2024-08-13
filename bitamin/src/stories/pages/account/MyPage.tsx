import { useState, useCallback } from 'react'
import PhotoUpload from 'stories/organisms/PhotoUpload'
import styles from 'styles/account/MyPage.module.css'
import HospitalMap from 'stories/organisms/HospitalMap'
import Button from 'stories/atoms/Button'

const MyPage: React.FC = () => {
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false)
  const [isFrameOpen, setFrameOpen] = useState(false)
  const [isFrame1Open, setFrame1Open] = useState(false)

  const openPhotoUpload = useCallback(() => {
    setIsPhotoUploadOpen(true)
  }, [])

  const closePhotoUpload = useCallback(() => {
    setIsPhotoUploadOpen(false)
  }, [])

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const openFrame1 = useCallback(() => {
    setFrame1Open(true)
  }, [])

  const closeFrame1 = useCallback(() => {
    setFrame1Open(false)
  }, [])

  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
      <Button
        label={'정보 수정'}
        type={'DEFAULT'}
        onClick={() => {
          console.log('정보수정 버튼 클릭')
        }}
      />
      <div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.item} />
        <div className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <div className={styles.userProfile03Wrapper}>
                <img
                  className={styles.userProfile03Icon}
                  alt=""
                  src="user-profile-03.svg"
                />
              </div>
              <div className={styles.eMail}>e-mail</div>
            </div>
          </div>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <div className={styles.userProfile03Container}>
                <img
                  className={styles.userProfile03Icon}
                  alt=""
                  src="user-profile-03.svg"
                />
              </div>
              <div className={styles.eMail}>이름</div>
            </div>
          </div>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <div className={styles.userProfile03Container}>
                <img
                  className={styles.userProfile03Icon}
                  alt=""
                  src="user-profile-03.svg"
                />
              </div>
              <div className={styles.eMail}>닉네임</div>
            </div>
          </div>
          <div className={styles.frameWrapper}>
            <div className={styles.frameGroup}>
              <div className={styles.userProfile03Container}>
                <img
                  className={styles.userProfile03Icon}
                  alt=""
                  src="calendar-06.svg"
                />
              </div>
              <div className={styles.div3}>생년월일 8자리</div>
            </div>
          </div>
        </div>
        <div className={styles.inner} />
        <div className={styles.div4}>마이페이지</div>
        <img
          className={styles.imageAddIcon}
          alt=""
          src="image-add.svg"
          onClick={openPhotoUpload}
        />
        <div className={styles.div5} onClick={openPhotoUpload}>
          <PhotoUpload />
        </div>
        <div className={styles.wrapper} onClick={openFrame}>
          <Button
            label={'정보 수정'}
            type={'DEFAULT'}
            onClick={() => {
              console.log('정보수정 버튼 클릭')
            }}
          />
        </div>
        <div className={styles.container} onClick={openFrame1}>
          <div className={styles.div6}>비밀번호 변경</div>
        </div>
        <div className={styles.rectangleDiv} />
        <div className={styles.div8}>7월 21일의 점수</div>
        <div className={styles.div9}>내 주변 병원 찾기</div>
        <div className={styles.div10}>검사 결과</div>
        <div className={styles.div11}>
          <span className={styles.span}>{`15 `}</span>
          <span className={styles.span1}>점</span>
        </div>
        <div className={styles.div12}>
          중한 우울 중한 수준의 우울감이 시사됩니다. 이러한 높은 수준의 우울감은
          흔히 신체적, 심리적 대처자원을 저하시키며 개인의 일상생활을 어렵게
          만들기도 합니다. 가까운 지역센터나 전문기관을 방문하여 보다 상세한
          평가와 도움을 받아보시기 바랍니다.
        </div>
        <div className={styles.child1} />
        <script
          type="text/javascript"
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_APP_KAKAOMAP_KEY}&libraries=services"
        ></script>
        <div className={styles.mapWrapper}>
          <HospitalMap />
        </div>
        {/* <div className={styles.child2} />
        <div className={styles.child3} />
        <div className={styles.child4} />
        <div className={styles.child5} />
        <div className={styles.child6} />
        <div className={styles.child7} />
        <div className={styles.child8} /> */}

        <div className={styles.div37}>검사 소견</div>
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onBItAMinTextClick}>
            BItAMin
          </div>
          <div className={styles.parent}>
            <div className={styles.div38} onClick={onBItAMinTextClick}>
              <div className={styles.frame}>
                <div className={styles.div6}>상담</div>
              </div>
              <div className={styles.child9} />
            </div>
            <div className={styles.div38} onClick={onBItAMinTextClick}>
              <div className={styles.frame}>
                <div className={styles.div6}>미션</div>
              </div>
              <div className={styles.child9} />
            </div>
            <div className={styles.div38} onClick={onBItAMinTextClick}>
              <div className={styles.group}>
                <div className={styles.div6}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child9} />
            </div>
            <div className={styles.div38} onClick={onBItAMinTextClick}>
              <div className={styles.frame}>
                <div className={styles.div6}>관리자</div>
              </div>
              <div className={styles.child9} />
            </div>
          </div>
          <div className={styles.div46}>
            <div className={styles.frameParent3}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameParent4}>
                  <div className={styles.wrapper3}>
                    <div className={styles.div47}>
                      <span className={styles.txt}>
                        <span>김싸피</span>
                        <span className={styles.span2}>
                          <span>{` `}</span>
                          <span className={styles.span3}>님</span>
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles.vectorWrapper}>
                    <img
                      className={styles.vectorIcon}
                      alt=""
                      src="Vector.svg"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.wrapper4} onClick={onBItAMinTextClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.groupChild} />
          <div className={styles.div48}>나의 차트</div>
        </div>
        <div className={styles.groupParent}>
          <div className={styles.chartParent}>
            <div className={styles.chart}>
              <img className={styles.groupIcon} alt="" src="Group.svg" />
              <div className={styles.group1}>
                <img className={styles.vectorIcon1} alt="" src="Vector.svg" />
                <div className={styles.group2}>
                  <div className={styles.group3}>
                    <img
                      className={styles.vectorIcon2}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div49}>0</div>
                  </div>
                  <div className={styles.group4}>
                    <img
                      className={styles.vectorIcon3}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div50}>15</div>
                  </div>
                  <div className={styles.group5}>
                    <img
                      className={styles.vectorIcon4}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div51}>30</div>
                  </div>
                  <div className={styles.group6}>
                    <img
                      className={styles.vectorIcon5}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div52}>45</div>
                  </div>
                  <div className={styles.group7}>
                    <img
                      className={styles.vectorIcon6}
                      alt=""
                      src="Vector.svg"
                    />
                    <div className={styles.div52}>60</div>
                  </div>
                </div>
              </div>
              <img className={styles.groupIcon1} alt="" src="Group.svg" />
              <img className={styles.groupIcon2} alt="" src="Group.svg" />
              <div className={styles.group8}>
                <img className={styles.vectorIcon7} alt="" src="Vector.svg" />
                <div className={styles.div54}>10</div>
              </div>
            </div>
            <div className={styles.div55}>(주차)</div>
            <div className={styles.div56}>(점수)</div>
          </div>
          <div className={styles.group9}>
            <img className={styles.vectorIcon8} alt="" src="Vector.svg" />
            <div className={styles.div57}>1</div>
          </div>
          <div className={styles.group10}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>2</div>
          </div>
          <div className={styles.group11}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>3</div>
          </div>
          <div className={styles.group12}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>4</div>
          </div>
          <div className={styles.group13}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>5</div>
          </div>
          <div className={styles.group14}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>6</div>
          </div>
          <div className={styles.group15}>
            <img className={styles.vectorIcon14} alt="" src="Vector.svg" />
            <div className={styles.div57}>7</div>
          </div>
          <div className={styles.group16}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>8</div>
          </div>
          <div className={styles.group17}>
            <img className={styles.vectorIcon9} alt="" src="Vector.svg" />
            <div className={styles.div57}>9</div>
          </div>
        </div>
        <div className={styles.div66}>
          <b>대전광역시 유성구</b>
          <span className={styles.span4}>
            <span>에 있는</span>
            <span className={styles.span5}>{` `}</span>
          </span>
          <b>정신과</b>
        </div>
      </div>
    </>
  )
}

export default MyPage
