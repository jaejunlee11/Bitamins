import { useCallback, useEffect, useState } from 'react'
import styles from 'styles/healthup/HealthUpListPage.module.css'
import exerciseAPI from '@/api/exerciseAPI'
import { useNavigate } from 'react-router-dom'
import homeExerciseImg from 'assets/image/homeExercise.png'
import YogaExerciseImg from 'assets/image/YogaExercise.png'

// interface execrciseModelInterface {
//   id: number
//   modelUrl: string
//   firstExercixe: number
//   secondExercise: number
//   thirdExercise: number
// }

const UP: React.FC = () => {
  const navigate = useNavigate()
  // 하루요가
  const onYogaClick = useCallback(() => {
    navigate('/healthup', { state: { level: 1 } }) // level 1: 하루 요가
  }, [navigate])

  // 하루홈트
  const onHomeTrainingClick = useCallback(() => {
    navigate('/healthup', { state: { level: 2 } }) // level 2: 하루 홈트
  }, [navigate])

  return (
    <div className={styles.up}>
      <div className={styles.upChild} />

      <div className={styles.rectangleParent} onClick={onYogaClick}>
        <div className={styles.rectangleDiv} onClick={onYogaClick} />
        <div className={styles.groupChild2}>
          <img
            className={styles.homeExerciseImg}
            alt=""
            src={homeExerciseImg}
          />
        </div>
        <div className={styles.div} onClick={onYogaClick}>
          하루 요가
        </div>
      </div>

      <div className={styles.groupChild} onClick={onHomeTrainingClick} />
      <div className={styles.groupChild3} />
      <div className={styles.homet}>
        <div className={styles.div1} onClick={onHomeTrainingClick}>
          하루 홈트
        </div>
        <img className={styles.YogaExerciseImg} alt="" src={YogaExerciseImg} />
      </div>
    </div>
  )
}

export default UP
