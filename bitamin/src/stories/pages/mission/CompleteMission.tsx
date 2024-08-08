import React, { useState, useEffect } from 'react';
import styles from '../../../styles/mission/quest2.module.css';
import { fetchMissionsByDate } from '@/api/missionAPI';

interface Mission {
    id: number;
    missionName: string;
    missionDescription: string;
    missionLevel: number;
    completeDate: string;
    imageUrl: string;
    missionReview: string;
}

// 현재 날짜를 가져오는 함수
const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const CompleteMission: React.FC = () => {
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const completeDate = getCurrentDate(); // 현재 날짜를 가져옴

    useEffect(() => {
        const getMission = async () => {
            try {
                const missionData = await fetchMissionsByDate(completeDate);
                setMission(missionData);
            } catch (error) {
                console.error('Error fetching mission:', error);
            } finally {
                setLoading(false);
            }
        };

        getMission();
    }, [completeDate]);

    return (
      <div className={styles.missionFormContainer}>
          {loading ? (
            <p>미션을 불러오는 중...</p>
          ) : mission ? (
            <>
                <div className={styles.todayMission}>
                    <h3>미션</h3>
                    <p>미션 이름: {mission.missionName}</p>
                    <p>미션 설명: {mission.missionDescription}</p>
                    <p>미션 레벨: {mission.missionLevel}</p>
                </div>
                <div className={styles.missionForm}>
                    <div>
                        <label htmlFor="missionReview">미션 리뷰:</label>
                        <input
                          id="missionReview"
                          type="text"
                          defaultValue={mission.missionReview}
                          required
                        />
                    </div>=
                    {mission.imageUrl && (
                      <div>
                          <img
                            src={mission.imageUrl}
                            alt="Mission"
                            style={{ width: '300px', height: 'auto', marginTop: '10px' }}
                          />
                      </div>
                    )}
                </div>
            </>
          ) : (
            <p>해당 날짜에 완료된 미션이 없습니다.</p>
          )}
      </div>
    );
};

export default CompleteMission;
