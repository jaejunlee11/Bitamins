import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as tmPose from '@teachablemachine/pose'
import exerciseAPI from '@/api/exerciseAPI'

interface execrciseModelInterface {
  id: number
  modelUrl: string
  firstExercise: number
  secondExercise: number
  thirdExercise: number
}

interface exerciseDescriptionInterface {
  id: number
  title: string
  description: string
  level: number
  exerciseUrl: string
}

const HealthUP: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [labelContainer, setLabelContainer] = useState<string[]>([])
  const location = useLocation()
  const { level } = location.state
  const [execrciseModel, setExecrciseModel] = useState<execrciseModelInterface>(
    {
      id: 3,
      modelUrl: 'https://teachablemachine.withgoogle.com/models/3a3h7O3tf/',
      firstExercise: 10,
      secondExercise: 11,
      thirdExercise: 12,
    }
  )
  const [exerciseDescription, setExerciseDescription] =
    useState<exerciseDescriptionInterface>({
      id: 5,
      title: '자세 이름',
      description: '자세 설명',
      level: 2,
      exerciseUrl:
        'https://bitamin-sassack.s3.ap-northeast-2.amazonaws.com/381495f2-8b15-46c9-b09f-0ae4407db89e_mainQuestImg.png',
    })
  const [predictContainer, setPredictContainer] = useState<number>(0)
  const [count, setCount] = useState<number>(500) // initialize count for the pose
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(1) // index to keep track of current model
  const [firstClassLabel, setFirstClassLabel] = useState<string>()
  const modelRef = useRef<tmPose.CustomPoseNet | null>(null)
  const webcamRef = useRef<tmPose.Webcam | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [buttonText, setButtonText] = useState<string>('시작 하기')

  useEffect(() => {
    const init = async () => {
      const URL = execrciseModel.modelUrl
      const modelURL = URL + 'model.json'
      const metadataURL = URL + 'metadata.json'

      // 모델 url 가져오기 -> level 1만 가지고 온 거 맞나?
      // const response = await exerciseAPI.fetchExerciseModel(1)
      const response = await exerciseAPI.fetchExerciseModel(level)
      setExecrciseModel(response)

      // 모델 세팅하기
      const model = await tmPose.load(modelURL, metadataURL)
      modelRef.current = model
      const maxPredictions = model.getTotalClasses()

      // 웹캠 세팅 하기
      const webcam = new tmPose.Webcam(200, 200, true) // width, height, flip
      await webcam.setup() // request access to the webcam
      await webcam.play()
      webcamRef.current = webcam
      window.requestAnimationFrame(loop)

      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = 200
        canvas.height = 200
        ctxRef.current = canvas.getContext('2d')
      }

      // 자세 이름 세팅하기
      const labels = await model.getClassLabels()
      setLabelContainer(labels)
      setFirstClassLabel(labels[1])
    }

    init()

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop()
      }
    }
  }, [])

  // 자세 시간을 다 채운 경우 다음 번호로 넘어가고 다음 버튼이 활성화
  // 추가로 다음 자세의 설명 받아오기
  useEffect(() => {
    if (count === 0) {
      console.log('Pose held for required time. Moving to the next pose.')
      setButtonText('다음')
    }
  }, [count])

  const nextPose = async () => {
    setCurrentModelIndex((prevIndex) => prevIndex + 1)
    if (currentModelIndex === 1) {
      const description = await exerciseAPI.fetchExercise(
        execrciseModel.firstExercise
      )
      setExerciseDescription(description)
      setCount(500)
      setButtonText('운동 중')
    } else if (currentModelIndex === 2) {
      const description = await exerciseAPI.fetchExercise(
        execrciseModel.secondExercise
      )
      setExerciseDescription(description)
      setCount(500)
      setButtonText('운동 중')
    } else if (currentModelIndex === 3) {
      const description = await exerciseAPI.fetchExercise(
        execrciseModel.thirdExercise
      )
      setExerciseDescription(description)
      setCount(500)
      setButtonText('운동 중')
    } else {
      // 다른 곳으로 라우팅 시키기
    }
  }

  const loop = async (timestamp: number) => {
    if (webcamRef.current && modelRef.current) {
      webcamRef.current.update() // update the webcam frame
      await predict()
      window.requestAnimationFrame(loop)
    }
  }

  const predict = async () => {
    if (modelRef.current && webcamRef.current) {
      const { pose, posenetOutput } = await modelRef.current.estimatePose(
        webcamRef.current.canvas
      )
      const prediction = await modelRef.current.predict(posenetOutput)

      if (prediction[currentModelIndex].probability > 0.7) {
        setCount((prevCount) => Math.max(prevCount - 1, 0))
      }

      setPredictContainer(prediction[currentModelIndex].probability)

      drawPose(pose)
    }
  }

  const drawPose = (pose: any) => {
    if (webcamRef.current && ctxRef.current) {
      ctxRef.current.drawImage(webcamRef.current.canvas, 0, 0)
    }
  }

  return (
    <div className="pose-detector">
      <div className="left">
        <div className="counting">
          <div>Count: {count / 100}</div>
          <div>{exerciseDescription.title}</div>
          <div className="label-container">
            {(predictContainer * 100).toFixed(2)}
          </div>
        </div>
        <div>
          <img src={exerciseDescription.exerciseUrl} alt="Exercise" />
        </div>
        <div>{exerciseDescription.description}</div>
      </div>
      <div className="right">
        <canvas ref={canvasRef} />
        <button id="nextButton" onClick={nextPose}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default HealthUP
