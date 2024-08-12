import { useCallback } from 'react'
import styles from 'styles/main/LandingPage.module.css'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const onClickLandingPage = useCallback(() => {
    navigate('/signup')
  }, [])

  return (
    <div className={styles.div} onClick={onClickLandingPage}>
      <div className={styles.betterTomorrowBetter}>
        Better tomorrow, Better Mind
      </div>
      <div className={styles.bitamim}>BItAMin은 당신을 응원합니다</div>
      <div className={styles.child} />
      <div className={styles.item} />
    </div>
  )
}

export default LandingPage
