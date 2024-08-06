import React from 'react'
import styles from '../../../styles/mission/quest2.module.css'
import Calendar from './Calendar'
import Weather from './Weather'
import Mission from './Mission'
import Nav from './Nav'

const MissionPage: React.FC = () => {
    return (
        <div className={styles.bigContainer}>
            <div className={styles.div}>
                <Nav />
                <div className={styles.customContainer}>
                    <Calendar />
                </div>
                <Mission />
                <Weather />
            </div>
        </div>
    );
};

export default MissionPage;
