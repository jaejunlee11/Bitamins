import React, { useState, useEffect, useCallback } from 'react'
import { fetchParticipants } from 'api/participantsAPI'
import MessageModal from './MessageModal'

interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
}

const ParticipantListPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const loadParticipants = async () => {
      const data = await fetchParticipants()
      setParticipants(data)
    }

    loadParticipants()
  }, [])

  const openModal = useCallback((participant: Participant) => {
    setSelectedParticipant(participant)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4">
        <span className="text-gray-600">2024-07-17</span>
      </div>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex justify-between items-center border-b pb-4"
        >
          <span className="font-semibold">{participant.memberNickname}</span>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => openModal(participant)}
          >
            메시지 보내기
          </button>
        </div>
      ))}
      {isModalOpen && selectedParticipant && (
        <MessageModal participant={selectedParticipant} onClose={closeModal} />
      )}
    </div>
  )
}

export default ParticipantListPage
