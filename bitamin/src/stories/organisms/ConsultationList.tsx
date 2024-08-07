import React, { useEffect, useState } from 'react'
import useConsultationStore from 'store/useConsultationStore'
import { fetchRandomParticipants, joinRoom } from 'api/consultationAPI'

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
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    number | null
  >(null)

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

  const handleFetchRandomParticipants = async (type: string) => {
    try {
      const response = await fetchRandomParticipants(type)
      console.log('Random Participants:', response)
      alert(`Fetched random participants for ${type}`)
    } catch (error) {
      alert('Failed to fetch random participants')
      console.error('Error fetching random participants:', error)
    }
  }

  const handleJoinRoom = async (
    consultationId: number,
    sessionId: string,
    isPrivated: boolean
  ) => {
    try {
      const joinData = {
        id: consultationId,
        isPrivated,
        password: isPrivated ? password : null,
        startTime: new Date().toISOString(),
        sessionId,
      }
      const response = await joinRoom(joinData)
      console.log('Join Room Response:', response)
      alert('Joined room successfully!')
    } catch (error) {
      alert('Failed to join room')
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
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={() =>
                    handleJoinRoom(
                      consultation.id,
                      consultation.sessionId,
                      consultation.isPrivated
                    )
                  }
                >
                  Join Room
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  handleJoinRoom(
                    consultation.id,
                    consultation.sessionId,
                    consultation.isPrivated
                  )
                }
              >
                Join Room
              </button>
            )}
            <br />
          </li>
        ))}
      </ul>
      <div>
        <h2>Fetch Random Participants</h2>
        <button onClick={() => handleFetchRandomParticipants('')}>전체</button>
        <br />
        <button onClick={() => handleFetchRandomParticipants('음악')}>
          음악
        </button>
        <br />
        <button onClick={() => handleFetchRandomParticipants('미술')}>
          미술
        </button>
        <br />
        <button onClick={() => handleFetchRandomParticipants('영화')}>
          영화
        </button>
        <br />
        <button onClick={() => handleFetchRandomParticipants('독서')}>
          독서
        </button>
        <br />
        <button onClick={() => handleFetchRandomParticipants('대화')}>
          대화
        </button>
        <br />
        <br />
      </div>
    </div>
  )
}

export default ConsultationList
