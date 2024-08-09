import React from 'react'
import useConsultationStore from 'store/useConsultationStore'

const ParticipantsList: React.FC = () => {
  const { subscribers } = useConsultationStore((state) => ({
    subscribers: state.subscribers,
  }))

  if (!subscribers || subscribers.length === 0) {
    return <div>No participants</div>
  }

  return (
    <div className="participants-list">
      <h2>Participants</h2>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.stream.connection.data}</li>
        ))}
      </ul>
    </div>
  )
}

export default ParticipantsList
