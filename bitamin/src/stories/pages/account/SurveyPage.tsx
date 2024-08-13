import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import styles from 'styles/account/SurveyPage.module.css'
import HeaderAfterLogin from '@/stories/organisms/common/HeaderAfterLogin'
import Footer from '@/stories/organisms/common/Footer'

const questions = [
  '평소에는 아무렇지도 않던 일들이 괴롭고 귀찮게 느껴졌다.',
  '먹고 싶지 않았고 식욕이 없었다.',
  '어느 누가 도와준다 하더라도, 나의 울적한 기분을 떨쳐버릴 수 없을 것 같았다.',
  '무슨 일을 하던 정신을 집중하기가 어려웠다.',
  '비교적 잘 지냈다.',
  '상당히 우울했다.',
  '모든 일들이 힘들게 느껴졌다.',
  '앞일이 암담하게 느껴졌다.',
  '지금까지의 내 인생은 실패작이라는 생각이 들었다.',
  '적어도 보통 사람들만큼의 능력은 있었다고 생각한다.',
  '잠을 설쳤다(잠을 잘 이루지 못했다).',
  '두려움을 느꼈다.',
  '평소에 비해 말수가 적었다.',
  '세상에 홀로 있는 듯한 외로움을 느꼈다.',
  '큰 불만 없이 생활했다.',
  '사람들이 나에게 차갑게 대하는 것 같았다.',
  '갑자기 울음이 나왔다.',
  '마음이 슬펐다.',
  '사람들이 나를 싫어하는 것 같았다.',
  '도무지 뭘 해 나갈 엄두가 나지 않았다.',
]

const SurveyPage: React.FC = () => {
  const [scores, setScores] = useState<number[]>(Array(20).fill(-1))
  const [canTakeSurvey, setCanTakeSurvey] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const username = 'User Name'

  useEffect(() => {
    const checkSurveyEligibility = async () => {
      try {
        const response = await axiosInstance.get(
          '/members/self-assessment/check'
        )
        const { result } = response.data

        if (result === 0) {
          setCanTakeSurvey(true) // 기록이 없으므로 설문조사 가능
        } else {
          setCanTakeSurvey(false) // 기록이 있으므로 설문조사 불가능
        }
      } catch (error) {
        console.error('Error checking survey eligibility:', error)
        setCanTakeSurvey(false) // 오류 발생 시 기본적으로 접근 불가 처리
      } finally {
        setLoading(false)
      }
    }

    checkSurveyEligibility()
  }, [])

  const handleScoreChange = useCallback((index: number, score: number) => {
    console.log(`Question ${index + 1} selected score: ${score}`)

    setScores((prevScores) => {
      const newScores = [...prevScores]
      newScores[index] = score
      return newScores
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    if (scores.includes(-1)) {
      alert('모든 질문에 답변해 주세요.')
      return
    }

    const totalScore = scores.reduce((acc, score) => acc + score, 0)

    const data = {
      checkupScore: totalScore,
      // checkupDate: new Date().toISOString().split('T')[0],
    }

    console.log('합산 점수:', totalScore)
    console.log('전송 데이터:', data)

    try {
      const response = await axiosInstance.post(
        '/members/self-assessment',
        data
      )
      console.log('응답 데이터:', response.data)
      alert('자가진단 점수가 성공적으로 전송되었습니다.')
    } catch (error) {
      console.error('점수 전송 실패:', error)
      alert('점수 전송에 실패했습니다.')
    }
  }, [scores])

  if (loading) {
    return <div>로딩 중...</div> // 로딩 상태 표시
  }

  if (!canTakeSurvey) {
    return (
      <div>
        이미 지난 일주일 동안 설문조사를 완료하셨습니다. 나중에 다시
        시도해주세요.
      </div>
    )
  }

  return (
    <>
      {/* <HeaderAfterLogin username={username} /> */}
      <div className={styles.div}>
        <div className={styles.item} />
        <div className={styles.inner} />
        <div className={styles.groupDiv}>
          <div className={styles.groupParent}>
            <div className={styles.component79Wrapper}>
              <div className={styles.component79}>
                <div className={styles.cesD}>우울증 척도 (CES-D)</div>
                <b className={styles.b}>
                  지난 1주동안 당신이 느끼고 행동한 것을 가장 잘 나타낸다고
                  생각되는 답변에 체크해주세요.
                </b>
              </div>
            </div>
            <div className={styles.frameWrapper}>
              <div className={styles.groupWrapper}>
                <div className={styles.frameParent}>
                  {questions.map((question, index) => (
                    <div key={index} className={styles.questionList}>
                      <div className={styles.questionBox}>
                        <div className={styles.div1}>
                          <div className={styles.wrapper}>
                            <div className={styles.div2}>{index + 1}</div>
                          </div>
                          <div className={styles.container}>
                            <div className={styles.div3}>{question}</div>
                          </div>
                        </div>
                        <div className={styles.group}>
                          <button
                            className={`${styles.div5} ${scores[index] === 0 ? styles.selected : ''}`}
                            onClick={() => handleScoreChange(index, 0)}
                          >
                            극히 드물게 (0점)
                          </button>
                          <button
                            className={`${styles.div7} ${scores[index] === 1 ? styles.selected : ''}`}
                            onClick={() => handleScoreChange(index, 1)}
                          >
                            가끔 (1점)
                          </button>
                          <button
                            className={`${styles.div9} ${scores[index] === 2 ? styles.selected : ''}`}
                            onClick={() => handleScoreChange(index, 2)}
                          >
                            자주 (2점)
                          </button>
                          <button
                            className={`${styles.div5} ${scores[index] === 3 ? styles.selected : ''}`}
                            onClick={() => handleScoreChange(index, 3)}
                          >
                            대부분 (3점)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bParent}>
          <div className={styles.b5} onClick={handleSubmit}>
            <b className={styles.div3}>설문 완료</b>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SurveyPage
