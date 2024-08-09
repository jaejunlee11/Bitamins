import React, { useState, useEffect } from 'react'
import styles from '/src/styles/mission/quest2.module.css'
import { fetchMissionsByDate } from '@/api/missionAPI'
import MissionForm from './MissionForm'
import { getMemberPhraseByDate } from '@/api/phraseAPI'

interface Mission {
  id: number;
  missionName: string;
  missionDescription: string;
  missionLevel: number;
  completeDate: string;
  imageUrl: string;
  missionReview: string;
}

interface CompleteMissionProps {
  selectedDate: string;
}

interface Record {
  id: number;
  phraseUrl: string;
}

const CompleteMission: React.FC<CompleteMissionProps> = ({ selectedDate }) => {
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const todayDate = new Date().toISOString().split('T')[0]
  const [record, setRecord] = useState<Record | null>(null)

  const getMission = async (date: string) => {
    setLoading(true)
    try {
      const missionData = await fetchMissionsByDate(date)
      setMission(missionData)
    } catch (error) {
      console.error('Error fetching mission:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMission(null) // 상태 초기화
    getMission(selectedDate)
  }, [selectedDate])

  const getRecord = async (date: string) => {
    setLoading(true)
    try {
      const recordDate = await getMemberPhraseByDate(date)
      setRecord(recordDate)
    } catch (error) {
      if (error instanceof Error && (error as any).response?.status !== 500) {
        console.error('Error fetching record:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setRecord(null) // 상태 초기화
    getRecord(selectedDate)
  }, [selectedDate])

  const handleSubmitSuccess = () => {
    getMission(selectedDate)
    getRecord(selectedDate)
  }

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
              <p id="missionReview">{mission.missionReview}</p>
            </div>
            {mission.imageUrl && (
              <div>
                <img
                  src={mission.imageUrl}
                  alt="Mission"
                  style={{ width: '300px', height: 'auto', marginTop: '10px' }}
                />
                {record?.phraseUrl && (
                  <div style={{ marginTop: '10px' }}>
                    <audio controls style={{ width: '300px' }}>
                      <source src={record.phraseUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        selectedDate === todayDate ? (
          <MissionForm selectedDate={selectedDate} onSubmitSuccess={handleSubmitSuccess} /> // 오늘 날짜에 미션이 없으면 MissionForm을 표시합니다.
        ) : (
          <p>해당 날짜에 완료된 미션이 없습니다.</p>
        )
      )}
    </div>
  )
}

export default CompleteMission
