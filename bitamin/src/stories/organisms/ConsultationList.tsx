import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinRoom } from 'api/consultationAPI'
import useConsultationStore from 'store/useConsultationStore'

const ConsultationList: React.FC = () => {
  const navigate = useNavigate()
  const {
    consultations,
    fetchAndSetConsultations,
    joinRandomParticipantsAndSetState,
    setJoinResponseData,
    setParticipant,
    setJoinData,
  } = useConsultationStore((state) => ({
    consultations: state.consultations,
    fetchAndSetConsultations: state.fetchAndSetConsultations,
    joinRandomParticipantsAndSetState: state.joinRandomParticipantsAndSetState,
    setJoinResponseData: state.setJoinResponseData,
    setParticipant: state.setParticipant,
    setJoinData: state.setJoinData,
  }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({})

  const loadConsultations = async () => {
    try {
      await fetchAndSetConsultations(0, 100, '전체')
      console.log('Fetched Consultations:', consultations)
    } catch (err) {
      setError('Failed to fetch consultations')
    } finally {
      console.log('Fetched Consultations:', consultations)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConsultations()
  }, [fetchAndSetConsultations])

  const handlePasswordChange = (consultationId: number, value: string) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [consultationId]: value,
    }))
  }

  const handleJoinRandomParticipants = async (type: string) => {
    try {
      await joinRandomParticipantsAndSetState(type)
      alert(`Fetched random participants for ${type}`)
    } catch (error) {
      alert('Failed to fetch random participants')
      console.error('Error fetching random participants:', error)
    }
  }

  const handleJoinRoom = async (consultation) => {
    try {
      const joinData = {
        id: consultation.id,
        isPrivated: consultation.isPrivated,
        password: consultation.isPrivated ? passwords[consultation.id] : null,
        startTime: consultation.startTime,
        sessionId: consultation.sessionId,
      }

      const joinResponse = await joinRoom(joinData)

      setJoinData(joinData)
      setParticipant(joinResponse)
      setJoinResponseData({
        token: joinResponse.token,
        sessionId: joinResponse.sessionId,
      })

      navigate('/consult')
    } catch (error) {
      console.error('Error joining room:', error)
      alert('Failed to join the room')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Consultation List</h1>
      <ul>
        {consultations.map((consultation) => (
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
        ))}
      </ul>
      <button onClick={() => {}}></button>
      <div>
        <h2>Fetch Random Participants</h2>
        <button onClick={() => handleJoinRandomParticipants('전체')}>
          전체
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('음악')}>
          음악
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('미술')}>
          미술
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('영화')}>
          영화
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('독서')}>
          독서
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('대화')}>
          대화
        </button>
        <br />
        <br />
      </div>
    </div>
  )
}

export default ConsultationList
