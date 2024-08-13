import { useState, useEffect, useCallback } from 'react'
import usePhraseStore from '@/store/usePhraseStore'
import styles from 'styles/main/MainPage.module.css'
import mainConsultImg from 'assets/image/mainConsultImg.png'
import mainQuestImg from 'assets/image/mainQuestImg.png'
import mainImg from 'assets/image/mainImg.png'
import recordBackGroundImg from 'assets/image/recordBackgroundImg.png'
import recordStart from 'assets/image/recordStart.png'
import recordSave from 'assets/image/recordSave.png'
import recordStop from 'assets/image/recordEnd.png'
import recordAgain from 'assets/image/recordAgain.png'
import recordPlay from 'assets/image/recordPlay.png'
import HeaderAfterLogin from '@/stories/organisms/common/HeaderAfterLogin'
import { getPhrases, saveAudio } from '@/api/phraseAPI'
import { useNavigate } from 'react-router-dom'

const MainPage: React.FC = () => {
  const navigate = useNavigate()

  const [isRecording, setIsRecording] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [media, setMedia] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [consultOpacityClass, setConsultOpacityClass] = useState(
    styles.transparent
  )
  const [questOpacityClass, setQuestOpacityClass] = useState(styles.transparent)
  const { phraseContent, phraseId, setPhrase } = usePhraseStore()

  useEffect(() => {
    const savedPhrase = localStorage.getItem('phraseContent')
    const savedPhraseId = localStorage.getItem('phraseId')
    const savedDate = localStorage.getItem('phraseDate')
    const todayDate = new Date().toISOString().split('T')[0]

    if (savedPhrase && savedPhraseId && savedDate === todayDate) {
      setPhrase(savedPhrase, savedPhraseId)
    } else {
      getPhrases()
        .then((data) => {
          if (data && data.phraseContent && data.id) {
            setPhrase(data.phraseContent, data.id)
            localStorage.setItem('phraseContent', data.phraseContent)
            localStorage.setItem('phraseId', data.id)
            localStorage.setItem('phraseDate', todayDate) // 현재 날짜를 저장
          }
        })
        .catch((error) => {
          console.error('Error fetching the phrase:', error)
        })
    }
  }, [setPhrase])

  // 나머지 코드들은 이전과 동일합니다.
  const onRecAudio = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.addEventListener('dataavailable', (e) => {
          const blob = e.data
          setAudioBlob(blob)
          setIsRecording(false)
        })

        mediaRecorder.start()
        setMedia(mediaRecorder)
        setIsRecording(true)
        setIsEnded(false)
      })
      .catch(() => {
        alert('마이크 사용 권한을 허용해야 녹음을 진행할 수 있습니다.')
      })
  }

  const offRecAudio = () => {
    if (media) {
      media.stop()
      media.stream.getAudioTracks().forEach((track) => track.stop())
      setMedia(null)
    }
    setIsRecording(false)
    setIsEnded(true)
  }

  const onPlayAudio = useCallback(() => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob))
      audio.play()
    }
  }, [audioBlob])

  const onSaveAudio = () => {
    // 여기에 서버로 업로드하는 로직을 추가할 수 있습니다.
    // setIsSaved(true);
    if (phraseId && audioBlob) {
      const formData = new FormData()
      formData.append(
        'memberPhraseRequest',
        new Blob(
          [
            JSON.stringify({
              phraseId: phraseId,
              saveDate: new Date().toISOString().split('T')[0],
            }),
          ],
          { type: 'application/json' }
        )
      )
      formData.append('phraseRecord', audioBlob)

      saveAudio(formData)
        .then((response) => {
          alert('녹음이 성공적으로 저장되었습니다.')
        })
        .catch((error) => {
          console.error('Error saving the audio:', error)
          alert('녹음 저장에 실패했습니다.')
        })
    } else {
      alert('녹음 파일이 없거나 문구 ID를 찾을 수 없습니다.')
    }
  }

  const onResetAudio = () => {
    setAudioBlob(null)
    setIsRecording(false)
    setIsEnded(false)
  }

  const onRecordClick = useCallback(() => {
    if (isRecording) {
      offRecAudio()
    } else {
      onRecAudio()
    }
  }, [isRecording])

  const onAgainClick = useCallback(() => {
    onResetAudio()
  }, [])

  const onPlayClick = useCallback(() => {
    onPlayAudio()
  }, [onPlayAudio])

  const onRectangleClick = useCallback(() => {}, [])

  const handleMouseEnterConsult = () => {
    setConsultOpacityClass(styles.opaque)
    document
      .querySelector(`.${styles.consultBorder}`)
      ?.classList.add(styles.glow)
  }

  const handleMouseLeaveConsult = () => {
    setConsultOpacityClass(styles.transparent)
    document
      .querySelector(`.${styles.consultBorder}`)
      ?.classList.remove(styles.glow)
  }

  const handleMouseEnterQuest = () => {
    setQuestOpacityClass(styles.opaque)
    document.querySelector(`.${styles.questBorder}`)?.classList.add(styles.glow)
  }

  const handleMouseLeaveQuest = () => {
    setQuestOpacityClass(styles.transparent)
    document
      .querySelector(`.${styles.questBorder}`)
      ?.classList.remove(styles.glow)
  }

  const onMissionClick = useCallback(() => {
    navigate('/mission')
  }, [navigate])

  const onconsultationClick = useCallback(() => {
    navigate('/consultationlist')
  }, [navigate])

  return (
    <>
      {/* <HeaderAfterLogin username="{username}" /> */}
      {/* <ModalExample /> */}
      <div className={styles.div}>
        {/* <div className={styles.navbar}>
          <div className={styles.bitamin}>BItAMin</div>
          <div className={styles.parent}>
            <div className={styles.div4} onClick={onRectangleClick}>
              <div className={styles.wrapper}>
                <div className={styles.b}>상담</div>
              </div>
              <div className={styles.child12} />
            </div>
            <div className={styles.div4} onClick={onRectangleClick}>
              <div className={styles.wrapper}>
                <div className={styles.b}>미션</div>
              </div>
              <div className={styles.child12} />
            </div>
            <div className={styles.div4} onClick={onRectangleClick}>
              <div className={styles.group}>
                <div className={styles.b}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child12} />
            </div>
            <div className={styles.div4} onClick={onRectangleClick}>
              <div className={styles.wrapper}>
                <div className={styles.b}>관리자</div>
              </div>
              <div className={styles.child12} />
            </div>
          </div>
          <div className={styles.div12}>
            <div className={styles.frameParent}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameGroup}>
                  <div className={styles.frameDiv}>
                    <div className={styles.div13}>
                      <span className={styles.txt}>
                        <span>김싸피</span>
                        <span className={styles.span}>
                          <span>{` `}</span>
                          <span className={styles.span1}>님</span>
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
              <div className={styles.wrapper1} onClick={onRectangleClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div> */}
        <div className={styles.inner}>
          <div className={styles.div3}>
            <p className={styles.p}>{phraseContent}</p>
          </div>
        </div>
        <div className={styles.recordBtns}>
          <img
            className={styles.recordBtn}
            alt=""
            src={isRecording ? recordStop : isEnded ? recordPlay : recordStart}
            onClick={isEnded ? onPlayClick : onRecordClick}
          />
          {isEnded && (
            <>
              <img
                className={styles.recordBtn}
                alt=""
                src={recordAgain}
                onClick={onAgainClick}
              />
              <img
                className={styles.recordBtn}
                alt=""
                src={recordSave}
                onClick={onSaveAudio}
              />
            </>
          )}
        </div>
        <img
          className={styles.recordBackgroundImg}
          alt=""
          src={recordBackGroundImg}
        />
        <div className={styles.consultBox} onClick={onRectangleClick} />
        <div className={styles.questBox} onClick={onRectangleClick} />
        <div
          className={styles.tryConsultBtn}
          onMouseEnter={handleMouseEnterConsult}
          onMouseLeave={handleMouseLeaveConsult}
          onClick={onconsultationClick}
        >
          <b className={styles.b}>상담하기</b>
        </div>
        <div
          className={styles.tryQuestBtn}
          onMouseEnter={handleMouseEnterQuest}
          onMouseLeave={handleMouseLeaveQuest}
          onClick={onMissionClick}
        >
          <b className={styles.b}>미션하기</b>
        </div>
        <img className={styles.mainImg} alt="" src={mainImg} />
        <div className={styles.consultBorder} />
        <img
          className={`${styles.mainConsultImg} ${consultOpacityClass}`}
          src={mainConsultImg}
          alt="Main Consult"
        />
        <div className={styles.questBorder} />
        <img
          className={`${styles.mainQuestImg} ${questOpacityClass}`}
          alt="Main Quest"
          src={mainQuestImg}
        />
      </div>
    </>
  )
}

export default MainPage
