import React, {useEffect, useState} from 'react';
import {fetchMissionsByDate} from '@/api/missionAPI';
import {getMemberPhraseByDate} from '@/api/phraseAPI';
import styles from '/src/styles/mission/MissionPage.module.css';
import reviewline from '@/assets/missionImage/reviewline.png';

interface CompleteMissionProps {
    selectedDate: Date | null;
}

const CompleteMission: React.FC<CompleteMissionProps> = ({selectedDate}) => {
    const [missionData, setMissionData] = useState<any>(null);
    const [phraseData, setPhraseData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMissionAndPhraseData = async () => {
            if (selectedDate) {
                setLoading(true);
                setError(null);

                setMissionData(null);
                setPhraseData(null);

                try {
                    const formattedDate = selectedDate.toISOString().split('T')[0];

                    const missionResponse = await fetchMissionsByDate(formattedDate);
                    if (missionResponse.success) {
                        setMissionData(missionResponse.data);
                    }

                    const phraseResponse = await getMemberPhraseByDate(formattedDate);
                    if (phraseResponse.success) {
                        setPhraseData(phraseResponse.data);
                    }

                    if (!missionResponse.success && !phraseResponse.success) {
                        setError('미션 또는 문구 데이터를 가져오는 데 실패했습니다.');
                    }
                } catch (err) {
                    setError('데이터를 가져오는 중 오류가 발생했습니다.');
                    console.error('Error fetching data:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMissionAndPhraseData();
    }, [selectedDate]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {missionData || phraseData ? (
                <div className={styles.missionContainer}>
                    {missionData && (
                        <>
                            <h3 className={styles.missionTitle}>
                                <div className={styles.missionDate}>
                                    {selectedDate?.getDate()}일 미션
                                </div>
                                <div className={styles.missionName}>
                                    {missionData.missionName}
                                </div>
                            </h3>

                            <div className={styles.missionContent}>
                                <img src={missionData.imageUrl} alt="Mission" className={styles.missionImage}/>
                                <div className={styles.missionDetails}>
                                    <p><strong>미션 설명:</strong> {missionData.missionDescription}</p>
                                    <p><strong>리뷰:</strong> {missionData.missionReview}</p>
                                </div>
                            </div>
                        </>
                    )}
                    {phraseData && (
                        <div className={styles.phraseContainer}>
                            {phraseData.phraseUrl && (
                                <audio controls className={styles.audioPlayer}>
                                    <source src={phraseData.phraseUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div>해당 날짜에 미션 또는 문구 데이터가 없습니다.</div>
            )}
        </div>
    );

};

export default CompleteMission;
