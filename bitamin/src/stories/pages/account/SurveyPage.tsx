import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import useAuthStore from '@/store/useAuthStore' // 경로를 실제 경로로 변경해주세요
import styles from 'styles/account/SurveyPage.module.css'

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
  const [scores, setScores] = useState<number[]>(Array(20).fill(0))
  // const { username: userId } = useAuthStore()
  const navigate = useNavigate()

  const handleScoreChange = (index: number, score: number) => {
    setScores((prevScores) => {
      const newScores = [...prevScores]
      newScores[index] = score
      return newScores
    })
  }

  const handleSubmit = useCallback(async () => {
    const totalScore = scores.reduce((acc, score) => acc + score, 0)
    const data = {
      // id: 'ai id',
      checkupScore: totalScore,
      // checkupDate: new Date().toISOString().split('T')[0],
      // memberId: userId, // useAuthStore에서 가져온 userId 사용
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

  const onBItAMinTextClick = useCallback(() => {
    navigate('/12')
  }, [navigate])

  const onContainerClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
      <div className={styles.div}>
        <img className={styles.child} alt="" src="Rectangle 4014.svg" />
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
                          className={styles.div5}
                          onClick={() => handleScoreChange(index, 0)}
                        >
                          극히 드물게 (0점)
                        </button>
                        <button
                          className={styles.div7}
                          onClick={() => handleScoreChange(index, 1)}
                        >
                          가끔 (1점)
                        </button>
                        <button
                          className={styles.div9}
                          onClick={() => handleScoreChange(index, 2)}
                        >
                          자주 (2점)
                        </button>
                        <button
                          className={styles.div5}
                          onClick={() => handleScoreChange(index, 3)}
                        >
                          대부분 (3점)
                        </button>
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
          <div className={styles.b7} onClick={onBItAMinTextClick}>
            <b className={styles.div3}>취소</b>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onBItAMinTextClick}>
            BItAMin
          </div>
          <div className={styles.parent38}>
            <div className={styles.div217} onClick={onContainerClick}>
              <div className={styles.wrapper38}>
                <div className={styles.div3}>상담</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div217} onClick={onContainerClick}>
              <div className={styles.wrapper38}>
                <div className={styles.div3}>미션</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div217} onClick={onContainerClick}>
              <div className={styles.parent39}>
                <div className={styles.div3}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
          </div>
          <div className={styles.div223}>
            <div className={styles.frameGroup}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameContainer}>
                  <div className={styles.wrapper40}>
                    <div className={styles.div224}>
                      <span className={styles.txt}>
                        <span>김싸피</span>
                        <span className={styles.span}>
                          <span>{}</span>
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
              <div className={styles.wrapper41} onClick={onContainerClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.child3} />
      </div>
    </>
  )
}

export default SurveyPage
