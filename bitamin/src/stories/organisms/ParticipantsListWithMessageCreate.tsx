import React, { useEffect, useState } from 'react'
import { fetchParticipants } from 'api/participantsAPI'
import { createMessage } from 'api/messageAPI'
import useParticipantStore from 'store/useParticipantStore'
import { useNavigate } from 'react-router-dom'

interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
}

const ParticipantsListWithMessageCreate: React.FC = () => {
  const participants = useParticipantStore((state) => state.participants)
  const setParticipants = useParticipantStore((state) => state.setParticipants)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<number | null>(null)
  const [receiverId, setReceiverId] = useState<number | null>(null)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [counselingDate, setCounselingDate] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const participantsData: Participant[] = await fetchParticipants()
        setParticipants(participantsData)
      } catch (err) {
        setError('Failed to fetch participants')
      } finally {
        setLoading(false)
      }
    }

    loadParticipants()
  }, [setParticipants])

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (receiverId === null) return

    try {
      const messageData = {
        receiverId,
        category,
        title,
        content,
        counselingDate,
      }
      await createMessage(messageData)
      alert('Message created successfully!')
      navigate('/messagelist') // Redirect to the message list page
    } catch (error) {
      alert('Failed to create message')
      console.error('Error creating message:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Participants List</h1>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id}>
            <p>
              <strong>Nickname:</strong> {participant.memberNickname}
            </p>
            <p>
              <strong>Consultation Date:</strong>{' '}
              {new Date(participant.consultationDate).toLocaleString()}
            </p>
            <p>
              <strong>Consultation ID:</strong> {participant.consultationId}
            </p>
            <p>
              <strong>Member ID:</strong> {participant.memberId}
            </p>
            <button
              onClick={() => {
                setShowForm(participant.memberId)
                setReceiverId(participant.memberId)
              }}
            >
              Create Message
            </button>
            <br />
            {showForm === participant.memberId && (
              <form onSubmit={handleCreateMessage}>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Counseling Date</label>
                  <input
                    type="datetime-local"
                    value={counselingDate}
                    onChange={(e) => setCounselingDate(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Create Message</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ParticipantsListWithMessageCreate
