import React, { useEffect, useState } from 'react'
import useConsultationStore from 'store/useConsultationStore'
import { joinRoom } from 'api/consultationAPI'
import { useNavigate } from 'react-router-dom'

const ConsultationList: React.FC = () => {
  const { consultations, fetchAndSetConsultations } = useConsultationStore(
    (state) => ({
      consultations: state.consultations,
      fetchAndSetConsultations: state.fetchAndSetConsultations,
    })
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState<string>('')
  const [selectedConsultation, setSelectedConsultation] = useState<
    number | null
  >(null)
  const navigate = useNavigate()

  const loadConsultations = async () => {
    try {
      await fetchAndSetConsultations(0, 100, '전체')
    } catch (err) {
      setError('Failed to fetch consultations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConsultations()
  }, [fetchAndSetConsultations])

  const handleJoinRoom = async (consultation: any) => {
    try {
      const joinData = {
        id: consultation.id,
        isPrivated: consultation.isPrivated,
        password: consultation.isPrivated ? password : null,
        startTime: consultation.startTime,
        sessionId: consultation.sessionId,
      }
      const joinResponse = await joinRoom(joinData)
      console.log('Join Room Response:', joinResponse)
      alert('Successfully joined the room!')
      navigate('/some-path') // 원하는 경로로 이동
    } catch (error) {
      alert('Failed to join the room')
      console.error('Error joining room:', error)
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
              <strong>Start Time:</strong>{' '}
              {new Date(consultation.startTime).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong>{' '}
              {new Date(consultation.endTime).toLocaleString()}
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
                {selectedConsultation === consultation.id ? (
                  <div>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={() => handleJoinRoom(consultation)}>
                      Join Room
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedConsultation(consultation.id)}
                  >
                    Enter Password to Join
                  </button>
                )}
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
    </div>
  )
}

export default ConsultationList
