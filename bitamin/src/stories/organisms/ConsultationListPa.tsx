import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchConsultationList,
  joinConsultation,
  useJoinRandomRoom,
} from 'store/useConsultationStore'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  JoinConsultation,
} from 'ts/consultationType' // 인터페이스 가져오기

const ConsultationListPa: React.FC = () => {
  const navigate = useNavigate()

  // zustand 스토어에서 상태 및 액션 가져오기
  const { ConsultationList, fetchConsultations } = fetchConsultationList(
    (state) => ({
      // ConsultationList의 기본값을 빈 객체로 설정하여 안전하게 접근할 수 있도록 합니다.
      ConsultationList: state.ConsultationList || { consultationList: [] },
      fetchConsultations: state.fetchConsultations,
    })
  )

  const { joinRoom, setJoinConsultation } = joinConsultation((state) => ({
    joinRoom: state.joinRoom,
    setJoinConsultation: state.setJoinConsultation,
  }))

  // 로딩 및 에러 상태 추가
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({})
  const [selectedType, setSelectedType] = useState<string>('전체')
  const { joinRandomRoom } = useJoinRandomRoom((state) => ({
    joinRandomRoom: state.joinRandomRoom,
  }))

  // 상담 리스트를 로드하는 함수
  const loadConsultations = async (
    page: number,
    size: number,
    type: string
  ) => {
    const roomSearch: RoomSearch = {
      page,
      size,
      type,
    }
    console.log(type)
    try {
      await fetchConsultations(roomSearch)
      console.log('Fetched Consultations:', ConsultationList)
    } catch (error) {
      console.error('Failed to fetch consultations:', error)
      setError('Failed to fetch consultations')
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트가 마운트될 때 상담 리스트를 로드
  useEffect(() => {
    loadConsultations(0, 100, selectedType)
  }, [selectedType])

  const handlePasswordChange = (consultationId: number, value: string) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [consultationId]: value,
    }))
  }

  const handleJoinRoom = async (consultation: Consultation) => {
    try {
      const joinData = {
        id: consultation.id,
        isPrivated: consultation.isPrivated,
        password: consultation.password || '',
        startTime: consultation.startTime,
        sessionId: consultation.sessionId,
      }

      // joinRoom이 성공적으로 완료되기를 기다립니다.
      const consult: JoinConsultation = await joinRoom(joinData)

      // joinRoom이 완료된 후 콘솔에 로그를 출력합니다.
      console.log('Join Room Result:', consult)
      console.log('Room joined:', joinData)
      setJoinConsultation(consult)
      // 페이지를 이동시킵니다.
      navigate('/consult')
    } catch (error) {
      console.error('Failed to join the room:', error)
      setError('Failed to join the room')
      navigate('/consultationlist')
    }
  }

  const handleJoinRandomRoom = async (type: string) => {
    try {
      await joinRandomRoom(type)
      // alert(`Fetched random participants for ${type}`)
    } catch (error) {
      alert('Failed to fetch random participants')
      console.error('Error fetching random participants:', error)
    }
  }

  const handleTypeChange = (type: string) => {
    console.log(type)
    setSelectedType(type)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Consultation List</h1>

      {/* 유형 선택 버튼 그룹 */}
      <div>
        <button onClick={() => handleTypeChange('전체')}>전체</button>
        <button onClick={() => handleTypeChange('음악')}>음악</button>
        <button onClick={() => handleTypeChange('미술')}>미술</button>
        <button onClick={() => handleTypeChange('영화')}>영화</button>
        <button onClick={() => handleTypeChange('독서')}>독서</button>
        <button onClick={() => handleTypeChange('대화')}>대화</button>
      </div>

      <ul>
        {/* consultationList가 존재할 때만 map 함수를 사용 */}
        {ConsultationList.consultationList &&
          ConsultationList.consultationList.map(
            (consultation: Consultation) => (
              <li key={consultation.id}>
                <p>
                  <strong>Category:</strong> {consultation.category}
                </p>
                <p>
                  <strong>Title:</strong> {consultation.title}
                </p>
                <p>
                  <strong>Start Time:</strong> {consultation.startTime}
                </p>
                <p>
                  <strong>End Time:</strong> {consultation.endTime}
                </p>
                <p>
                  <strong>Current Participants:</strong>{' '}
                  {consultation.currentParticipants}
                </p>
                <p>
                  <strong>Session ID:</strong> {consultation.sessionId}
                </p>
                {consultation.isPrivated ? (
                  <div>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={passwords[consultation.id] || ''}
                      onChange={(e) =>
                        handlePasswordChange(consultation.id, e.target.value)
                      }
                    />
                    <button onClick={() => handleJoinRoom(consultation)}>
                      Join Room
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleJoinRoom(consultation)}>
                    Join Room
                  </button>
                )}
                <br />
              </li>
            )
          )}
      </ul>
      <div>
        <h2>Fetch Random Participants</h2>
        <button onClick={() => handleJoinRandomRoom('전체')}>전체</button>
        <br />
        <button onClick={() => handleJoinRandomRoom('음악')}>음악</button>
        <br />
        <button onClick={() => handleJoinRandomRoom('미술')}>미술</button>
        <br />
        <button onClick={() => handleJoinRandomRoom('영화')}>영화</button>
        <br />
        <button onClick={() => handleJoinRandomRoom('독서')}>독서</button>
        <br />
        <button onClick={() => handleJoinRandomRoom('대화')}>대화</button>
        <br />
        <br />
      </div>
    </div>
  )
}

export default ConsultationListPa
