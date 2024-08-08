import React, { useState } from 'react';
import Calendar from './Calendar.tsx';
import CompleteMission from './CompleteMission.tsx';
import styles from '/src/styles/mission/quest2.module.css';

const MissionPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };

  return (
    <div className={styles.missionPageContainer}>
      <div className={styles.calendarContainer}>
        <Calendar onDateChange={handleDateChange} />
      </div>
      <div className={styles.completeMissionContainer}>
        {selectedDate && <CompleteMission selectedDate={selectedDate} />}
      </div>
    </div>
  );
};

export default MissionPage;
