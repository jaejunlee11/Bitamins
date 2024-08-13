import React, { useEffect, useState } from 'react'
import { fetchMessageDetail } from 'api/messageAPI'
import { useParams } from 'react-router-dom'

interface Reply {
  id: number
  memberNickName: string
  content: string
  isRead: number
  sendDate: string
}

interface Message {
  id: number
  nickname: string
  category: string
  title: string
  content: string
  sendDate: string
  counselingDate?: string
  isRead: number
  replies: Reply[]
}

const MessageDetailPage: React.FC = () => {
  const { messageId } = useParams<{ messageId: string }>()
  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMessageDetail = async () => {
      try {
        const messageData = await fetchMessageDetail(1)
        setMessage(messageData)
      } catch (err) {
        setError('Failed to fetch message details')
      } finally {
        setLoading(false)
      }
    }

    loadMessageDetail()
  }, [messageId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      {message ? (
        <div>
          <h1>{message.title}</h1>
          <p>
            <strong>From:</strong> {message.nickname}
          </p>
          <p>
            <strong>Category:</strong> {message.category}
          </p>
          <p>
            <strong>Content:</strong> {message.content}
          </p>
          <p>
            <strong>Send Date:</strong>{' '}
            {new Date(message.sendDate).toLocaleString()}
          </p>
          {message.counselingDate && (
            <p>
              <strong>Counseling Date:</strong>{' '}
              {new Date(message.counselingDate).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Status:</strong> {message.isRead ? 'Read' : 'Unread'}
          </p>
          <h2>Replies</h2>
          <ul>
            {message.replies.map((reply) => (
              <li key={reply.id}>
                <p>
                  <strong>{reply.memberNickName}:</strong> {reply.content}
                </p>
                <p>
                  <small>{new Date(reply.sendDate).toLocaleString()}</small>
                </p>
                <p>{reply.isRead ? 'Read' : 'Unread'}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No message details available</div>
      )}
    </div>
  )
}

export default MessageDetailPage
