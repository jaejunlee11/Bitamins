import React, { useEffect, useState } from 'react'
import useConsultationStore from 'store/useConsultationStore'

const ConsultationList: React.FC = () => {
  const {
    consultations,
    fetchAndSetConsultations,
    joinRoomAndSetState,
    joinRandomParticipantsAndSetState,
  } = useConsultationStore((state) => ({
    consultations: state.consultations,
    fetchAndSetConsultations: state.fetchAndSetConsultations,
    joinRoomAndSetState: state.joinRoomAndSetState,
    joinRandomParticipantsAndSetState: state.joinRandomParticipantsAndSetState,
  }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({})

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

  const handleJoinRoom = async (
    consultationId: number,
    sessionId: string,
    isPrivated: boolean
  ) => {
    try {
      const joinData = {
        id: consultationId,
        isPrivated,
        password: isPrivated ? passwords[consultationId] : null,
        startTime: new Date().toISOString(),
        sessionId,
        token: '', // token will be set by the API response
      }
      await joinRoomAndSetState(joinData)
      alert('Joined room successfully!')
    } catch (error) {
      alert('Failed to join room')
      console.error('Error joining room:', error)
    }
  }

  const handlePasswordChange = (consultationId: number, value: string) => {
    setPasswords({
      ...passwords,
      [consultationId]: value,
    })
  }

  const handlejoinRandomParticipants = async (type: string) => {
    try {
      await joinRandomParticipantsAndSetState(type)
      alert(`Fetched random participants for ${type}`)
    } catch (error) {
      alert('Failed to fetch random participants')
      console.error('Error fetching random participants:', error)
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
                  value={passwords[consultation.id] || ''}
                  onChange={(e) =>
                    handlePasswordChange(consultation.id, e.target.value)
                  }
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
        <button onClick={() => handlejoinRandomParticipants('전체')}>
          전체
        </button>
        <br />
        <button onClick={() => handlejoinRandomParticipants('음악')}>
          음악
        </button>
        <br />
        <button onClick={() => handlejoinRandomParticipants('미술')}>
          미술
        </button>
        <br />
        <button onClick={() => handlejoinRandomParticipants('영화')}>
          영화
        </button>
        <br />
        <button onClick={() => handlejoinRandomParticipants('독서')}>
          독서
        </button>
        <br />
        <button onClick={() => handlejoinRandomParticipants('대화')}>
          대화
        </button>
        <br />
        <br />
      </div>
    </div>
  )
}

export default ConsultationList
