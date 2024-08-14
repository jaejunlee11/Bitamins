import styles from 'styles/message/MessageListPage.module.css'
import React, { useState, useCallback } from 'react'

import MessageListPage from 'stories/organisms/MessageListPage'
import ParticipantListPage from 'stories/organisms/ParticipantListPage'

const MessageListMainPage: React.FC = () => {
  const onFrameContainerClick = useCallback(() => {
    // Add your code here
  }, [])
  const [activeTab, setActiveTab] = useState('messages')

  return (
    <>
      <div className="p-4 mx-auto max-w-screen-lg">
        {' '}
        {/* 추가된 클래스 */}
        <div className="p-4 mx-auto" style={{ maxWidth: '60%' }}>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'messages' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            쪽지함
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'participants' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('participants')}
          >
            같이 한 사람
          </button>
        </div>
        {activeTab === 'messages' && <MessageListPage />}
        {activeTab === 'participants' && <ParticipantListPage />}
      </div>

      <div className={`${styles.div} mx-auto max-w-screen-lg`}>
        {' '}
        {/* 추가된 클래스 */}
        <div className={styles.child} />
        <div className={styles.item} />
        <div className={styles.frameParent}>
          <div className={styles.ellipseParent} onClick={onFrameContainerClick}>
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.parent}>
              <div className={styles.div1}>
                같이 이야기 나눌 수 있어서 너무 좋았어요
              </div>
              <div className={styles.div2}>2024.07.23 17:50:50</div>
            </div>
            <div className={styles.div3}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div5}>2024.07.23 17:50:50</div>
          </div>
          <div className={styles.group} onClick={onFrameContainerClick}>
            <div className={styles.div6}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <img className={styles.frameItem} alt="" src="Ellipse 130.png" />
            <div className={styles.div7}>가나다라마바</div>
            <img className={styles.trash02Icon} alt="" src="trash-02.svg" />
          </div>
          <div className={styles.ellipseParent} onClick={onFrameContainerClick}>
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.parent}>
              <div className={styles.div1}>
                같이 이야기 나눌 수 있어서 너무 좋았어요
              </div>
              <div className={styles.div2}>2024.07.23 17:50:50</div>
            </div>
            <div className={styles.div3}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div5}>2024.07.23 17:50:50</div>
          </div>
          <div className={styles.ellipseParent} onClick={onFrameContainerClick}>
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.parent}>
              <div className={styles.div1}>
                같이 이야기 나눌 수 있어서 너무 좋았어요
              </div>
              <div className={styles.div2}>2024.07.23 17:50:50</div>
            </div>
            <div className={styles.div3}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div5}>2024.07.23 17:50:50</div>
          </div>
          <div className={styles.ellipseParent} onClick={onFrameContainerClick}>
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.parent}>
              <div className={styles.div1}>
                같이 이야기 나눌 수 있어서 너무 좋았어요
              </div>
              <div className={styles.div2}>2024.07.23 17:50:50</div>
            </div>
            <div className={styles.div3}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div5}>2024.07.23 17:50:50</div>
          </div>
          <div
            className={styles.ellipseParent2}
            onClick={onFrameContainerClick}
          >
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.div7}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div25}>2024.07.23 17:50:50</div>
          </div>
          <div
            className={styles.ellipseParent2}
            onClick={onFrameContainerClick}
          >
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.div7}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div25}>2024.07.23 17:50:50</div>
          </div>
          <div
            className={styles.ellipseParent2}
            onClick={onFrameContainerClick}
          >
            <img className={styles.frameChild} alt="" src="Ellipse 130.png" />
            <div className={styles.div7}>가나다라마바</div>
            <div className={styles.div4}>
              같이 이야기 나눌 수 있어서 너무 좋았어요
            </div>
            <div className={styles.div25}>2024.07.23 17:50:50</div>
          </div>
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.wrapper}>
            <b className={styles.b}>쪽지함</b>
          </div>
          <div className={styles.frame} onClick={onFrameContainerClick}>
            <b className={styles.b}>같이 한 사람</b>
          </div>
        </div>
        <img className={styles.inner} alt="" src="Group 337.png" />
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onFrameContainerClick}>
            BItAMin
          </div>
          <div className={styles.parent2}>
            <div className={styles.div32} onClick={onFrameContainerClick}>
              <div className={styles.wrapper1}>
                <div className={styles.b}>상담</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div32} onClick={onFrameContainerClick}>
              <div className={styles.wrapper1}>
                <div className={styles.b}>미션</div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
            <div className={styles.div32} onClick={onFrameContainerClick}>
              <div className={styles.parent3}>
                <div className={styles.b}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.rectangleDiv} />
            </div>
          </div>
          <div className={styles.div38}>
            <div className={styles.frameContainer}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameParent1}>
                  <div className={styles.wrapper3}>
                    <div className={styles.div39}>
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
              <div className={styles.wrapper4} onClick={onFrameContainerClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageListMainPage
