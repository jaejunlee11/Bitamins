import React, { useState } from 'react'
import styles from '/src/styles/mission/quest2.module.css'
import Calendar from './Calendar.tsx'
import Weather from './Weather.tsx'
import Mission from './Mission.tsx'
import Nav from './Nav.tsx'
import MissionForm from './MissionForm.tsx'

const MissionPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [missionData, setMissionData] = useState<any>(null);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd 형식으로 변환
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate(null);
        }
    };

    const handleMissionDataChange = (data: any) => {
        setMissionData(data);
    };

    return (
      <div className={styles.bigContainer}>
          <div className={styles.div}>
              <Nav />
              <div className={styles.customContainer}>
                  <Calendar onDateChange={handleDateChange} onMissionDataChange={handleMissionDataChange} />
              </div>
              <MissionForm selectedDate={selectedDate} missionData={missionData} />
              <Mission />
              <Weather />
          </div>
      </div>
    );
};

export default MissionPage;
