import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import styles from 'styles/account/MyPage.module.css'
import HospitalMap from 'stories/organisms/HospitalMap'
import Button from 'stories/atoms/Button'
import { fetchUserInfo, updateUserInfo } from '@/api/userAPI'
import { fetchHealthReports } from '@/api/userAPI'
import { useNavigate } from 'react-router-dom'

const MyPage: React.FC = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    nickname: '',
    birthday: '',
    sidoName: '',
    gugunName: '',
    dongName: '',
    image: null as File | null, // 새로 업로드할 파일
    profileUrl: '', // 서버에서 받아온 이미지 URL
    checkupScore: 0,
    checkupDate: '', // 건강 보고서 날짜
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 미리보기 URL 상태

  // 타입 불일치로 초기값 number 타입으로 설정
  const [location, setLocation] = useState({
    lat: 0, // 기본값 설정
    lng: 0, // 기본값 설정
  })

  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false)
  const [isFrameOpen, setFrameOpen] = useState(false)
  const [isFrame1Open, setFrame1Open] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [healthReports, setHealthReports] = useState<any[]>([])

  // 점수에 따른 메시지 반환 함수
  const getScoreMessage = (score: number): string => {
    if (score <= 15) {
      return `현재 당신의 점수는 정상 범위에 속합니다. 유의미한 수준의 우울감이 나타나지 않으며, 전반적으로 안정된 상태를 유지하고 있습니다. 이러한 상태를 지속적으로 유지하기 위해 현재의 생활 습관을 잘 관리하시길 권장드립니다. 만약 기분 변화가 느껴지거나 불안함이 생긴다면, 가벼운 산책이나 취미 생활을 통해 긍정적인 기운을 유지하는 것도 도움이 될 수 있습니다.`
    } else if (score <= 20) {
      return `다소 경미한 수준의 우울감이 느껴질 수 있습니다. 이러한 기분은 일상생활에 큰 지장을 주지는 않지만, 지속된다면 심리적, 신체적 자원에 영향을 미칠 가능성이 있습니다. 지금은 충분한 휴식과 자기 돌봄이 중요한 시기입니다. 스스로의 감정에 귀 기울이고, 필요하다면 가까운 친구나 가족과 대화를 나누며 마음을 나누어 보세요. 또한, 이러한 기분이 지속될 경우 가까운 지역센터나 전문기관을 찾아 전문가의 도움을 받는 것도 좋은 방법입니다.`
    } else if (score <= 24) {
      return `현재 당신의 점수는 중간 정도의 우울감을 나타내고 있습니다. 이 정도의 우울감은 종종 일상생활에 어려움을 초래할 수 있으며, 신체적, 심리적 에너지를 저하시킬 가능성이 큽니다. 이러한 상황에서는 혼자 감정을 다루기보다는 전문가의 도움을 받는 것이 좋습니다. 가까운 지역센터나 전문기관에서 상담을 받아보는 것을 적극 권장드립니다. 전문가와 함께라면 당신의 기분 상태를 더 잘 이해하고, 필요한 지원을 받을 수 있을 것입니다.`
    } else {
      return `현재 점수는 심각한 수준의 우울감을 나타내며, 즉각적인 전문적인 지원이 필요할 수 있습니다. 이 정도의 우울감은 일상생활의 기능을 크게 저하시킬 수 있으며, 신체적, 심리적 건강에 심각한 영향을 미칠 수 있습니다. 가능한 빨리 전문기관을 찾아가 치료적 개입과 평가를 받아보시기를 강력히 권장드립니다. 전문가의 도움을 통해, 당신의 현재 상태를 개선할 수 있는 구체적인 방법을 찾을 수 있을 것입니다. 혼자가 아닌, 함께 극복해 나가는 것이 중요합니다.`
    }
  }

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo()
        // console.log('Fetched user data:', data) // 데이터를 확인하는 로그
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          email: data.email,
          name: data.name,
          nickname: data.nickname,
          birthday: data.birthday,
          sidoName: data.sidoName,
          gugunName: data.gugunName,
          dongName: data.dongName,
          profileUrl: data.profileUrl,
        }))
        // 서버에서 받은 프로필 이미지 URL을 미리보기 URL로 설정
        setPreviewUrl(data.profileUrl)

        setLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        })
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    const getHealthReports = async () => {
      try {
        const healthReports = await fetchHealthReports()
        if (healthReports.length > 0) {
          // 가장 최근의 보고서 선택 (마지막 항목)
          const latestReport = healthReports[healthReports.length - 1]
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            checkupScore: latestReport.checkupScore,
            checkupDate: latestReport.checkupDate,
          }))
        }
      } catch (error) {
        console.error('Error fetching health reports:', error)
      }
    }

    getUserInfo()
    getHealthReports()
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

  // 수정 시 사용
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'image' && files && files[0]) {
      const imageFile = files[0]
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        image: imageFile,
      }))
      // 새로 업로드한 이미지의 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(imageFile)
      setPreviewUrl(previewUrl) // 미리보기 URL을 상태에 저장
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [name]: value,
      }))
    }
  }

  // 사용자 정보 저장 시
  const handleUpdateUserInfo = async () => {
    try {
      await updateUserInfo(userInfo)
      alert('정보가 성공적으로 수정되었습니다.')
      setIsEditing(false)
      // 서버에 저장된 최신 프로필 사진 불러오기
      const data = await fetchUserInfo()
      setPreviewUrl(data.imageUrl)
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        profileUrl: data.profileUrl,
        image: null, // 업로드된 파일 초기화
      }))
    } catch (error) {
      console.error('Error updating user info:', error)
      alert('정보 수정에 실패했습니다.')
    }
  }
  // 점수에 따른 설명을 가져옴
  const scoreDescription = getScoreMessage(userInfo.checkupScore)

  return (
    <>
      <Button
        label={isEditing ? '취소' : '정보 수정'}
        type={'DEFAULT'}
        onClick={() => {
          if (isEditing) {
            setIsEditing(false)
            // 수정 취소 시 서버에서 최신 정보를 다시 불러옴
            const getUserInfo = async () => {
              try {
                const data = await fetchUserInfo()
                setPreviewUrl(data.profileUrl)
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  email: data.email,
                  name: data.name,
                  nickname: data.nickname,
                  birthday: data.birthday,
                  sidoName: data.sidoName,
                  gugunName: data.gugunName,
                  dongName: data.dongName,
                  profileUrl: data.profileUrl,
                  image: null,
                }))
              } catch (error) {
                console.error('Error fetching user info on cancel:', error)
              }
            }

            getUserInfo()
          } else {
            setIsEditing(true)
          }
        }}
      />
      <div className={styles.div}>
        {/* 화면 상단에 이미지 표시 */}
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
        {/* 나머지 컴포넌트 */}
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
              {/* {userInfo.image && (
                <img
                  src={URL.createObjectURL(userInfo.image)}
                  alt="Profile"
                  className={styles.image}
                />
              )} */}
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
          {/* <Button
            label={'정보 수정'}
            type={'DEFAULT'}
            onClick={() => {
              console.log('정보수정 버튼 클릭')
            }}
          /> */}
        </div>
        <div
          className={styles.container}
          onClick={() => navigate('/change-password')}
        >
          <div className={styles.div6}>비밀번호 변경</div>
        </div>
        <div className={styles.rectangleDiv} />
        <div className={styles.div8}>7월 21일의 점수</div>
        <div className={styles.div9}>내 주변 병원 찾기</div>
        <div className={styles.div10}>검사 결과</div>
        <div className={styles.div11}>
          <span className={styles.span}>{userInfo.checkupScore}</span>
          <span className={styles.span1}>점</span>
        </div>
        {/* <div className={styles.div12}>
          중한 우울 중한 수준의 우울감이 시사됩니다. 이러한 높은 수준의 우울감은
          흔히 신체적, 심리적 대처자원을 저하시키며 개인의 일상생활을 어렵게
          만들기도 합니다. 가까운 지역센터나 전문기관을 방문하여 보다 상세한
          평가와 도움을 받아보시기 바랍니다.
        </div> */}
        <div className={styles.div12}>{scoreDescription}</div>
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
