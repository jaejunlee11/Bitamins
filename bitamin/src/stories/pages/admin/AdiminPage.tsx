import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from 'styles/admin/AdiminPage.module.css'

const AdiminPage: React.FC = () => {
  const [isFrameOpen, setFrameOpen] = useState(false)
  const navigate = useNavigate()

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  const onContainerClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <>
      <div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.item} />
        <div className={styles.inner}>
          <div className={styles.wrapper}>
            <div className={styles.text}>신고 내역</div>
          </div>
        </div>
        <div className={styles.table} onClick={openFrame}>
          <div className={styles.column0}>
            <div className={styles.textWrapper}>
              <div className={styles.text}>비고</div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>16</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>15</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>14</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>13</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>12</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>11</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>10</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>9</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>8</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>7</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>6</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>5</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>4</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>3</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>2</div>
              </div>
            </div>
            <div className={styles.column0Inner}>
              <div className={styles.textContainer}>
                <div className={styles.text}>1</div>
              </div>
            </div>
          </div>
          <div className={styles.column1}>
            <div className={styles.textWrapper15}>
              <div className={styles.text}>신고 구분</div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>화상 회의</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>쪽지</div>
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.textWrapper15}>
              <div className={styles.text}>신고자</div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>가나다라마바사</div>
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.textWrapper15}>
              <div className={styles.text}>피신고자</div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>아자차카타파하</div>
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <div className={styles.textWrapper15}>
              <div className={styles.text}>신고일시</div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.11</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.10</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.09</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.08</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.07</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.06</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.05</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.04</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.03</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.02</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.01</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.00</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.08.01</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.07.31</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.07.30</div>
              </div>
            </div>
            <div className={styles.column1Inner}>
              <div className={styles.textWrapper16}>
                <div className={styles.text}>2024.07.29</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onBItAMinTextClick}>
            BItAMin
          </div>
          <div className={styles.parent}>
            <div className={styles.div2} onClick={onBItAMinTextClick}>
              <div className={styles.container}>
                <div className={styles.text}>상담</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div2} onClick={onBItAMinTextClick}>
              <div className={styles.container}>
                <div className={styles.text}>미션</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div2} onClick={onBItAMinTextClick}>
              <div className={styles.group}>
                <div className={styles.text}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div2} onClick={onContainerClick}>
              <div className={styles.container}>
                <div className={styles.text}>관리자</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
          </div>
          <div className={styles.div10}>
            <div className={styles.frameParent}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameGroup}>
                  <div className={styles.wrapper2}>
                    <div className={styles.div11}>
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
              <div className={styles.wrapper3} onClick={onBItAMinTextClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
            <div className={styles.frameContainer}>
              <div className={styles.frameWrapper} onClick={onBItAMinTextClick}>
                <div className={styles.wrapper4}>
                  <div className={styles.text}>마이페이지</div>
                </div>
              </div>
              <div
                className={styles.frameWrapper1}
                onClick={onBItAMinTextClick}
              >
                <div className={styles.wrapper4}>
                  <div className={styles.div13}>로그아웃</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdiminPage
