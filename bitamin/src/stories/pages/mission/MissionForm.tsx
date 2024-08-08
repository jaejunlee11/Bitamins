import React, { useState, useEffect } from 'react';
import styles from '/src/styles/mission/quest2.module.css';
import { submitMission, fetchTodayMission, substituteMission } from '@/api/missionAPI';

interface Mission {
    id: number;
    missionName: string;
    missionDescription: string;
    missionLevel: number;
}

interface MissionFormProps {
    selectedDate: string | null;
    missionData?: Mission | null;
    onSubmitSuccess: () => void; // 추가된 콜백 함수
}

const MissionForm: React.FC<MissionFormProps> = ({ selectedDate, missionData, onSubmitSuccess }) => {
    const [missionReview, setMissionReview] = useState('');
    const [missionImage, setMissionImage] = useState<File | null>(null);
    const [todayMission, setTodayMission] = useState<Mission | null>(null);

    useEffect(() => {
        const fetchMission = async () => {
            if (!missionData) {
                try {
                    const data = await fetchTodayMission();
                    setTodayMission(data);
                } catch (error) {
                    console.error('Error fetching today\'s mission:', error);
                }
            } else {
                setTodayMission(missionData);
            }
        };

        fetchMission();
    }, [missionData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMissionImage(e.target.files[0]);
        }
    };

    const handleMissionSubstitute = async () => {
        if (!todayMission) return;

        try {
            const newMission = await substituteMission(todayMission.id);
            setTodayMission(newMission);
        } catch (error) {
            console.error('Error substituting mission:', error);
        }
    };

    const getCurrentDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!todayMission) return;

        const completeDate = getCurrentDate();
        const memberMissionRequest = {
            completeDate,
            missionReview,
            missionId: todayMission.id,
        };

        const formData = new FormData();
        formData.append('memberMissionRequest', new Blob([JSON.stringify(memberMissionRequest)], { type: 'application/json' }));
        if (missionImage) {
            formData.append('missionImage', missionImage);
        }

        // 전송할 데이터 콘솔에 출력
        console.log('Submitting form data:', {
            completeDate,
            missionReview,
            missionId: todayMission.id,
            missionImage,
        });

        try {
            await submitMission(formData);
            console.log('미션이 성공적으로 등록되었습니다!');
            onSubmitSuccess(); // 미션 등록 성공 시 콜백 호출
        } catch (error: any) {
            console.error('Error submitting mission:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // 서버 응답 출력
            }
        }
    };

    return (
      <div className={styles.missionFormContainer}>
          {todayMission ? (
            <div className={styles.todayMission}>
                <h3>미션</h3>
                <p>미션 이름: {todayMission.missionName}</p>
                <p>미션 설명: {todayMission.missionDescription}</p>
                <p>미션 레벨: {todayMission.missionLevel}</p>
                <button onClick={handleMissionSubstitute}>미션 교체</button>
            </div>
          ) : (
            <p>미션을 불러오는 중...</p>
          )}
          <form onSubmit={handleSubmit} className={styles.missionForm}>
              <div>
                  <label htmlFor="missionReview">미션 리뷰:</label>
                  <input
                    id="missionReview"
                    type="text"
                    value={missionReview}
                    onChange={(e) => setMissionReview(e.target.value)}
                    required
                  />
              </div>
              <div>
                  <label htmlFor="missionImage">미션 이미지:</label>
                  <input
                    id="missionImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
              </div>
              <button type="submit">미션 등록</button>
          </form>
      </div>
    );
};

export default MissionForm;
