import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from 'styles/account/SurveyPage.module.css'

const SurveyPage: React.FC = () => {
  const [isFrame1Open, setFrame1Open] = useState(false)
  const [isFrame2Open, setFrame2Open] = useState(false)
  const navigate = useNavigate()

  const openFrame1 = useCallback(() => {
    setFrame1Open(true)
  }, [])

  const closeFrame1 = useCallback(() => {
    setFrame1Open(false)
  }, [])

  const openFrame2 = useCallback(() => {
    setFrame2Open(true)
  }, [])

  const closeFrame2 = useCallback(() => {
    setFrame2Open(false)
  }, [])

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
                <div className={styles.cesD}>{`우울증 척도 (CES-D) `}</div>
                <b className={styles.b}>
                  지난 1주동안 당신이 느끼고 행동한 것을 가장 잘 나타낸다고
                  생각되는 답변에 체크해주세요.
                </b>
              </div>
            </div>
            <div className={styles.frameWrapper}>
              <div className={styles.groupWrapper}>
                <div className={styles.frameParent}>
                  <div className={styles.parent}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div2}>1</div>
                      </div>
                      <div className={styles.container}>
                        <div className={styles.div3}>
                          평소에는 아무렇지도 않던 일들이 괴롭고 귀찮게
                          느껴졌다.
                        </div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frameDiv}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>2</div>
                      </div>
                      <div className={styles.container}>
                        <div className={styles.div3}>
                          먹고 싶지 않았고 식욕이 없었다.
                        </div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div6}>
                        <b className={styles.b1}>극히 드물게 (1일 이하)</b>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent2}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>3</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`어느 누가 도와준다 하더라도, 나의 울적한 기분을 떨쳐버릴   수 없을 것 같았다. `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent4}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>4</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`무슨 일을 하던 정신을 집중하기가 어려웠다.      `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent6}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>5</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`비교적 잘 지냈다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent8}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>6</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`상당히 우울했다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent10}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>7</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`모든 일들이 힘들게 느껴졌다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent12}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>8</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`앞일이 암담하게 느껴졌다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div6}>
                        <b className={styles.b1}>극히 드물게 (1일 이하)</b>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent14}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>9</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`지금까지의 내 인생은 실패작이라는 생각이 들었다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent16}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>10</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`적어도 보통 사람들만큼의 능력은 있었다고 생각한다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent18}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>11</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`잠을 설쳤다(잠을 잘 이루지 못했다).       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent20}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>12</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`두려움을 느꼈다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent22}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>13</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`평소에 비해 말수가 적었다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent24}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>14</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`세상에 홀로 있는 듯한 외로움을 느꼈다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div6}>
                        <b className={styles.b1}>극히 드물게 (1일 이하)</b>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent26}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>15</div>
                      </div>
                      <div className={styles.wrapper3}>
                        <div
                          className={styles.div24}
                        >{`큰 불만 없이 생활했다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent28}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>16</div>
                      </div>
                      <div className={styles.container}>
                        <div
                          className={styles.div24}
                        >{`사람들이 나에게 차갑게 대하는 것 같았다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent30}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>17</div>
                      </div>
                      <div className={styles.container}>
                        <div
                          className={styles.div24}
                        >{`갑자기 울음이 나왔다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent32}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>18</div>
                      </div>
                      <div className={styles.container}>
                        <div
                          className={styles.div24}
                        >{`마음이 슬펐다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent34}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>19</div>
                      </div>
                      <div className={styles.container}>
                        <div
                          className={styles.div24}
                        >{`사람들이 나를 싫어하는 것 같았다.       `}</div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div4}>
                        <div className={styles.div5}>
                          극히 드물게 (1일 이하)
                        </div>
                      </div>
                      <div className={styles.div6}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.parent36}>
                    <div className={styles.div1}>
                      <div className={styles.wrapper}>
                        <div className={styles.div13}>20</div>
                      </div>
                      <div className={styles.container}>
                        <div className={styles.div3}>
                          도무지 뭘 해 나갈 엄두가 나지 않았다.
                        </div>
                      </div>
                    </div>
                    <div className={styles.group}>
                      <div className={styles.div6}>
                        <b className={styles.b1}>극히 드물게 (1일 이하)</b>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div7}>가끔 (1-2일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div9}>자주 (3-4일)</div>
                      </div>
                      <div className={styles.div4}>
                        <div className={styles.div5}>대부분 (5-7일)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bParent}>
          <div className={styles.b5} onClick={openFrame1}>
            <b className={styles.div3}>설문 완료</b>
          </div>
          <div className={styles.b7} onClick={openFrame2}>
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
