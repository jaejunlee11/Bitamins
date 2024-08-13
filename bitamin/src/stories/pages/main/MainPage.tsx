import { useState, useCallback } from 'react'
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
import ModalExample from 'stories/organisms/ModalExample'

const MainPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [media, setMedia] = useState<MediaRecorder | null>(null)
  const [audioUrl, setAudioUrl] = useState<Blob | null>(null)
  // const [isSaved, setIsSaved] = useState(false);
  // const [isRecorded, setIsRecorded] = useState(false);
  const [consultOpacityClass, setConsultOpacityClass] = useState(
    styles.transparent
  )
  const [questOpacityClass, setQuestOpacityClass] = useState(styles.transparent)

  const onRecAudio = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.addEventListener('dataavailable', (e) => {
          setAudioUrl(e.data)
          // setIsRecorded(true);
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
    if (audioUrl) {
      const audio = new Audio(URL.createObjectURL(audioUrl))
      audio.play()
    }
  }, [audioUrl])

  const onSaveAudio = () => {
    // 여기에 서버로 업로드하는 로직을 추가할 수 있습니다.
    // setIsSaved(true);
  }

  const onResetAudio = () => {
    setAudioUrl(null)
    // setIsSaved(false);
    // setIsRecorded(false);
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

  const onRectangleClick = useCallback(() => {
    // Add your code here
  }, [])

  const handleMouseEnterConsult = () => {
    setConsultOpacityClass(styles.opaque)
    // @ts-ignore
    document
      .querySelector(`.${styles.consultBorder}`)
      .classList.add(styles.glow)
  }

  const handleMouseLeaveConsult = () => {
    setConsultOpacityClass(styles.transparent)
    // @ts-ignore
    document
      .querySelector(`.${styles.consultBorder}`)
      .classList.remove(styles.glow)
  }

  const handleMouseEnterQuest = () => {
    setQuestOpacityClass(styles.opaque)
    // @ts-ignore
    document.querySelector(`.${styles.questBorder}`).classList.add(styles.glow)
  }

  const handleMouseLeaveQuest = () => {
    setQuestOpacityClass(styles.transparent)
    // @ts-ignore
    document
      .querySelector(`.${styles.questBorder}`)
      .classList.remove(styles.glow)
  }

  return (
    <>
      <ModalExample />
      <div className={styles.div}>
        <div className={styles.navbar}>
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
        </div>
        <div className={styles.inner}>
          <div className={styles.div3}>
            <p className={styles.p}>오늘 하루도 최선을 다한 당신,</p>
            <p className={styles.p}>멋져요!</p>
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
        >
          <b className={styles.b}>상담하기</b>
        </div>
        <div
          className={styles.tryQuestBtn}
          onMouseEnter={handleMouseEnterQuest}
          onMouseLeave={handleMouseLeaveQuest}
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
