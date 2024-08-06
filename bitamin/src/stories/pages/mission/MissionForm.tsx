import React, { useState, useEffect } from 'react';
import styles from '../../../styles/mission/quest2.module.css';
import { submitMission, fetchTodayMission } from '@/api/missionAPI';

const MissionForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [missionReview, setMissionReview] = useState('');
    const [missionImage, setMissionImage] = useState<File | null>(null);
    const [todayMission, setTodayMission] = useState<any>(null);

    useEffect(() => {
        const getTodayMission = async () => {
            try {
                const data = await fetchTodayMission();
                setTodayMission(data);
            } catch (error) {
                console.error('Error fetching today\'s mission:', error);
            }
        };

        getTodayMission();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('missionId', todayMission.id);
        formData.append('missionReview', missionReview);
        formData.append('date', new Date().toISOString().split('T')[0]); // 오늘 날짜

        if (missionImage) {
            formData.append('missionImage', missionImage);
        }

        try {
            await submitMission(formData);
            onSubmit();
        } catch (error) {
            console.error('Error submitting mission:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMissionImage(e.target.files[0]);
        }
    };

    return (
        <div className={styles.missionFormContainer}>
            {todayMission ? (
                <div className={styles.todayMission}>
                    <h3>오늘의 미션</h3>
                    <p>미션 이름: {todayMission.missionName}</p>
                    <p>미션 설명: {todayMission.missionDescription}</p>
                    <p>미션 레벨: {todayMission.missionLevel}</p>
                </div>
            ) : (
                <p>오늘의 미션을 불러오는 중...</p>
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
