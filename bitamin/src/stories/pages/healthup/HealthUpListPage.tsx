import { useCallback } from 'react'
import styles from 'styles/healthup/HealthUpListPage.module.css'

const UP: React.FC = () => {
  const onRectangleClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <div className={styles.up}>
      <div className={styles.upChild} />
      <div className={styles.rectangleParent}>
        <div className={styles.groupChild} onClick={onRectangleClick} />
        <img className={styles.groupItem} alt="" src="Star 4.svg" />
        <img className={styles.groupInner} alt="" src="Star 5.svg" />
        <img className={styles.starIcon} alt="" src="Star 7.svg" />
        <img className={styles.groupChild1} alt="" src="Star 8.svg" />
        <img className={styles.groupChild2} alt="" src="Star 6.svg" />
        <div className={styles.div}>하루 요가</div>
      </div>
      <div className={styles.rectangleGroup}>
        <div className={styles.rectangleDiv} onClick={onRectangleClick} />
        <div className={styles.groupChild3} />
        <div className={styles.ellipseDiv} />
        <div className={styles.groupChild4} />
        <div className={styles.groupChild5} />
        <div className={styles.groupChild6} />
        <div className={styles.groupChild7} />
        <div className={styles.groupChild8} />
        <div className={styles.groupChild9} />
        <div className={styles.groupChild10} />
        <div className={styles.groupChild11} />
        <div className={styles.groupChild12} />
        <div className={styles.groupChild13} />
        <div className={styles.groupChild14} />
        <div className={styles.groupChild15} />
        <div className={styles.groupChild16} />
        <img className={styles.component49Icon} alt="" src="Component 49.png" />
        <img className={styles.component50Icon} alt="" src="Component 50.png" />
        <img className={styles.component51Icon} alt="" src="Component 51.png" />
        <img className={styles.component53Icon} alt="" src="Component 53.png" />
        <img className={styles.component52Icon} alt="" src="Component 52.png" />
        <div className={styles.div1}>하루 홈트</div>
      </div>
      <div className={styles.upItem} />
      <div className={styles.upInner} />
      <img className={styles.component53Icon1} alt="" src="Component 53.svg" />
      <div className={styles.navbar}>
        <div className={styles.bitamin} onClick={onRectangleClick}>
          BItAMin
        </div>
        <div className={styles.parent}>
          <div className={styles.div2} onClick={onRectangleClick}>
            <div className={styles.wrapper}>
              <div className={styles.div3}>상담</div>
            </div>
            <div className={styles.child} />
          </div>
          <div className={styles.div2} onClick={onRectangleClick}>
            <div className={styles.wrapper}>
              <div className={styles.div3}>미션</div>
            </div>
            <div className={styles.child} />
          </div>
          <div className={styles.div6} onClick={onRectangleClick}>
            <div className={styles.group}>
              <div className={styles.div3}>건강</div>
              <div className={styles.upWrapper}>
                <div className={styles.up1}>UP !</div>
              </div>
            </div>
            <div className={styles.inner} />
          </div>
        </div>
        <div className={styles.div8}>
          <div className={styles.frameParent}>
            <div className={styles.personcircleParent}>
              <img
                className={styles.personcircleIcon}
                alt=""
                src="PersonCircle.svg"
              />
              <div className={styles.frameGroup}>
                <div className={styles.frame}>
                  <div className={styles.div9}>
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
                  <img className={styles.vectorIcon} alt="" src="Vector.svg" />
                </div>
              </div>
            </div>
            <div className={styles.frameDiv} onClick={onRectangleClick}>
              <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UP
