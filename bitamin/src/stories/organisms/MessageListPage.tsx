import React, { useEffect, useState } from 'react'
import { fetchMessages } from 'api/messageAPI'
import { Link } from 'react-router-dom'

interface Message {
  id: number
  nickname: string
  category: string
  title: string
  sendDate: string
  isRead: number
}

const MessageListPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageData = await fetchMessages()
        setMessages(messageData)
      } catch (err) {
        setError('Failed to fetch messages')
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Message List</h1>
      <br />
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <Link to={`/messages/${message.id}`}>
              <p>
                <strong>{message.nickname}:</strong> {message.title}
              </p>
              <p>Category: {message.category}</p>
              <p>Send Date: {new Date(message.sendDate).toLocaleString()}</p>
              <p>{message.isRead ? 'Read' : 'Unread'}</p>
              <br />
            </Link>
          </li>
        ))}
      </ul>
      <br />
    </div>
  )
}

export default MessageListPage
