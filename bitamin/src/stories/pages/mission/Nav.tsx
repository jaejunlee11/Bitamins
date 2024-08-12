import React, { useCallback } from 'react'
import styles from '/src/styles/mission/quest2.module.css'

const Nav: React.FC = () => {
    const onContainerClick = useCallback(() => {
        // Add your code here
    }, []);

    return (
        <div className={styles.navbar}>
            <div className={styles.bitamin} onClick={onContainerClick}>BItAMin</div>
            <div className={styles.parent8}>
                <div className={styles.div95} onClick={onContainerClick}>
                    <div className={styles.wrapper42}>
                        <div className={styles.b}>상담</div>
                    </div>
                    <div className={styles.rectangleDiv}/>
                </div>
                <div className={styles.div97} onClick={onContainerClick}>
                    <div className={styles.wrapper42}>
                        <div className={styles.b}>미션</div>
                    </div>
                    <div className={styles.child1}/>
                </div>
                <div className={styles.div95} onClick={onContainerClick}>
                    <div className={styles.parent9}>
                        <div className={styles.b}>건강</div>
                        <div className={styles.upWrapper}>
                            <div className={styles.up}>UP !</div>
                        </div>
                    </div>
                    <div className={styles.rectangleDiv}/>
                </div>
            </div>
            <div className={styles.div101}>
                <div className={styles.frameContainer}>
                    <div className={styles.personcircleParent}>
                        <img className={styles.personcircleIcon} alt="" src="PersonCircle.svg"/>
                        <div className={styles.frameParent1}>
                            <div className={styles.wrapper44}>
                                <div className={styles.div102}>
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
                                <img className={styles.vectorIcon1} alt="" src="Vector.svg"/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper45} onClick={onContainerClick}>
                        <img className={styles.icon} alt="" src="쪽지 버튼.svg"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav;
