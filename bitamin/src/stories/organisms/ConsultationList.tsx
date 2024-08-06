// src/components/ConsultationList.tsx
import React, { useEffect, useState } from 'react'
import useConsultationStore from 'store/useConsultationStore'

const ConsultationList: React.FC = () => {
  const { consultations, fetchAndSetConsultations } = useConsultationStore(
    (state) => ({
      consultations: state.consultations,
      fetchAndSetConsultations: state.fetchAndSetConsultations,
    })
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
            <br />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ConsultationList
