import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import styles from 'styles/account/MyPage.module.css'
import HospitalMap from 'stories/organisms/HospitalMap'
import Button from 'stories/atoms/Button'
import { fetchUserInfo, updateUserInfo } from '@/api/userAPI'

const MyPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    nickname: '',
    birthday: '',
    sidoName: '',
    gugunName: '',
    dongName: '',
    image: null as File | null, // 파일은 null로 초기화
  })

  // 타입 불일치로 초기값 number 타입으로 설정
  const [location, setLocation] = useState({
    lat: 0, // 기본값 설정
    lng: 0, // 기본값 설정
  })

  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false)
  const [isFrameOpen, setFrameOpen] = useState(false)
  const [isFrame1Open, setFrame1Open] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo()
        setUserInfo({
          email: data.email,
          name: data.name,
          nickname: data.nickname,
          birthday: data.birthday,
          sidoName: data.sidoName,
          gugunName: data.gugunName,
          dongName: data.dongName,
          image: null,
        })
        setLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        })
        // console.log(data.lat)
      } catch (error) {
        console.error(error)
      }
    }

    getUserInfo()
  }, [])

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files) {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        image: files[0],
      }))
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [name]: value,
      }))
    }
  }

  const handleUpdateUserInfo = async () => {
    console.log(userInfo)
    try {
      await updateUserInfo(userInfo)
      alert('정보가 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error(error)
      alert('정보 수정에 실패했습니다.')
    }
  }
  return (
    <>
      <Button
        label={isEditing ? '취소' : '정보 수정'}
        type={'DEFAULT'}
        onClick={() => setIsEditing(!isEditing)}
      />
      <div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.item} />
        <div className={styles.frameParent}>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="nickname"
                value={userInfo.nickname}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="birthday"
                value={userInfo.birthday}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="sidoName"
                value={userInfo.sidoName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="gugunName"
                value={userInfo.gugunName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="dongName"
                value={userInfo.dongName}
                onChange={handleInputChange}
              />
              <input
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png"
                onChange={handleInputChange}
              />

              <Button
                label={'저장'}
                type={'DEFAULT'}
                onClick={handleUpdateUserInfo}
              />
            </div>
          ) : (
            <div>
              <div>{userInfo.email}</div>
              <div>{userInfo.name}</div>
              <div>{userInfo.nickname}</div>
              <div>{userInfo.birthday}</div>
              <div>{userInfo.sidoName}</div>
              <div>{userInfo.gugunName}</div>
              <div>{userInfo.dongName}</div>
              {userInfo.image && (
                <img
                  src={URL.createObjectURL(userInfo.image)}
                  alt="Profile"
                  className={styles.image}
                />
              )}
            </div>
          )}
        </div>
        <div className={styles.inner} />
        <div className={styles.div4}>마이페이지</div>
        <img
          className={styles.imageAddIcon}
          alt=""
          src="image-add.svg"
          onClick={openPhotoUpload}
        />
        <div className={styles.div5} onClick={openPhotoUpload}></div>
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
          <HospitalMap lat={location.lat} lng={location.lng} />
        </div>
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
          <b>{userInfo.sidoName} </b>
          <b>{userInfo.gugunName}</b>
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
