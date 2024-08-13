import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { submitMission } from '@/api/missionAPI';

const Missionform: React.FC = () => {
    const { mission, substituteCount, fetchMission, handleSubstituteMission } = useMissionStore();
    const [missionReview, setMissionReview] = useState<string>('');
    const [missionImage, setMissionImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchMission();
    }, [fetchMission]);

    const handleMissionSubmit = async () => {
        if (!mission || !missionImage) {
            setError('리뷰와 이미지를 모두 입력해야 합니다.');
            return;
        }

        try {
            setLoading(true);
            const completeDate = new Date().toISOString().split('T')[0];
            const formData = new FormData();
            formData.append("memberMissionRequest", JSON.stringify({
                missionReview,
                completeDate,
                missionId: mission.id
            }));
            formData.append("missionImage", missionImage);

            const response = await submitMission(formData);
            if (response.success) {
                alert('미션이 성공적으로 제출되었습니다.');
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('미션을 제출하는 도중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {mission ? (
                <div>
                    <h1>{mission.missionName}</h1>
                    <p>{mission.missionDescription}</p>
                    <p>Level: {mission.missionLevel}</p>
                    <button onClick={handleSubstituteMission} disabled={substituteCount >= 5}>
                        미션 교체하기 ({5 - substituteCount}번 남음)
                    </button>
                    <div>
                        <textarea
                            value={missionReview}
                            onChange={(e) => setMissionReview(e.target.value)}
                            placeholder="미션 리뷰를 입력하세요"
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setMissionImage(e.target.files[0]);
                                }
                            }}
                        />
                        <button onClick={handleMissionSubmit}>미션 제출하기</button>
                    </div>
                </div>
            ) : (
                <p>미션이 없습니다.</p>
            )}
        </div>
    );
}

export default Missionform;
