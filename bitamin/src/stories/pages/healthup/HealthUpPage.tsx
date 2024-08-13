import { useCallback, useEffect, useRef } from 'react'
import * as tmPose from '@teachablemachine/pose'
import * as tf from '@tensorflow/tfjs'
import styles from 'styles/healthup/HealthUpPage.module.css'

const HealthUP: React.FC = () => {
  const onGroupContainerClick = useCallback(() => {
    // Add your code here
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const URL = 'my_model/' // 상대 경로로 수정
    let model: tmPose.CustomPoseNet
    let webcam: tmPose.Webcam
    let ctx: CanvasRenderingContext2D
    let labelContainer: HTMLElement
    let maxPredictions: number

    async function init() {
      const modelURL = `${URL}model.json`
      const metadataURL = `${URL}metadata.json`

      try {
        model = await tmPose.load(modelURL, metadataURL)
        maxPredictions = model.getTotalClasses()

        const size = 600
        const flip = true
        webcam = new tmPose.Webcam(size, size, flip)
        await webcam.setup()
        await webcam.play()
        window.requestAnimationFrame(loop)

        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = size
          canvas.height = size
          ctx = canvas.getContext('2d')!
        }
        labelContainer = labelContainerRef.current!
        for (let i = 0; i < maxPredictions; i++) {
          labelContainer.appendChild(document.createElement('div'))
        }
      } catch (error) {
        console.error('Failed to load model:', error)
      }
    }

    async function loop(timestamp: number) {
      webcam.update()
      await predict()
      window.requestAnimationFrame(loop)
    }

    async function predict() {
      const { pose, posenetOutput } = await model.estimatePose(webcam.canvas)
      const prediction = await model.predict(posenetOutput)

      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`
        labelContainer.childNodes[i].textContent = classPrediction
      }

      drawPose(pose)
    }

    function drawPose(pose: any) {
      if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0)
        if (pose) {
          const minPartConfidence = 0.5
          tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx)
          tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx)
        }
      }
    }

    init()
  }, [])

  return (
    <div className={styles.up}>
      <div className={styles.upChild} />
      <div className={styles.rectangleParent}>
        <img className={styles.groupChild} alt="" src="Rectangle 4080.png" />
        <div className={styles.div}>20:00</div>
      </div>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      <div
        ref={labelContainerRef}
        id="label-container"
        className={styles.labelContainer}
      ></div>
      <div className={styles.rectangleGroup} onClick={onGroupContainerClick}>
        <div className={styles.groupItem} />
        <b className={styles.b}>나가기</b>
      </div>
      <b className={styles.b1}>목</b>
      <div className={styles.div1}>다리</div>
      <div className={styles.div2}>어깨</div>
      <div className={styles.videoOffParent}>
        <img className={styles.videoOffIcon} alt="" src="video-off.svg" />
        <div className={styles.div3}>비디오 중지</div>
      </div>
      <div className={styles.microphoneOff01Parent}>
        <img
          className={styles.microphoneOff01Icon}
          alt=""
          src="microphone-off-01.svg"
        />
        <div className={styles.div4}>음소거</div>
      </div>
      <div className={styles.navbar}>
        <div className={styles.bitamin} onClick={onGroupContainerClick}>
          BItAMin
        </div>
        <div className={styles.parent}>
          <div className={styles.div5} onClick={onGroupContainerClick}>
            <div className={styles.wrapper}>
              <div className={styles.div6}>상담</div>
            </div>
            <div className={styles.child} />
          </div>
          <div className={styles.div5} onClick={onGroupContainerClick}>
            <div className={styles.wrapper}>
              <div className={styles.div6}>미션</div>
            </div>
            <div className={styles.child} />
          </div>
          <div className={styles.div9} onClick={onGroupContainerClick}>
            <div className={styles.group}>
              <div className={styles.div6}>건강</div>
              <div className={styles.upWrapper}>
                <div className={styles.up1}>UP !</div>
              </div>
            </div>
            <div className={styles.inner} />
          </div>
        </div>
        <div className={styles.div11}>
          <div className={styles.frameParent}>
            <div className={styles.personcircleParent}>
              <img
                className={styles.personcircleIcon}
                alt=""
                src="PersonCircle.svg"
              />
              <div className={styles.frameGroup}>
                <div className={styles.frame}>
                  <div className={styles.div12}>
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
                  <img className={styles.vectorIcon1} alt="" src="Vector.svg" />
                </div>
              </div>
            </div>
            <div className={styles.frameDiv} onClick={onGroupContainerClick}>
              <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.div13}>
        <p className={styles.p}>
          목과 어깨가 길어지는 것을 느끼며 이완해주세요
        </p>
        <p className={styles.p}>내쉬는 호흡에 길게 몸을 늘려주세요</p>
      </div>
      <div className={styles.upChild2} />
      <div className={styles.upChild3} />
      <div className={styles.div14}>하루 홈트</div>
    </div>
  )
}

export default HealthUP
