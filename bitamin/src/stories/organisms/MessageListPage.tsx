import React, { useState, useEffect } from 'react'
import { fetchMessages, deleteMessage } from 'api/messageAPI'
import { useNavigate } from 'react-router-dom'

interface Message {
  id: number
  nickname: string
  title: string
  sendDate: string
}

const MessageListPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchMessages()
      setMessages(data)
    }

    loadMessages()
  }, [])

  const handleDelete = async (id: number) => {
    await deleteMessage(id)
    setMessages(messages.filter((message) => message.id !== id))
  }

  const handleMouseEnter = (id: number) => {
    setHoveredMessageId(id)
  }

  const handleMouseLeave = () => {
    setHoveredMessageId(null)
  }

  return (
    <ul className="space-y-2">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer ${
            hoveredMessageId === message.id
              ? 'bg-green-500 text-white'
              : 'bg-white'
          }`}
          onMouseEnter={() => handleMouseEnter(message.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate(`/messages/${message.id}`)}
        >
          <div className="flex items-center space-x-4">
            <img src="path/to/icon.png" alt="icon" className="w-6 h-6" />
            <span
              className={`font-semibold ${hoveredMessageId === message.id ? 'text-white' : 'text-red-500'}`}
            >
              {message.nickname}
            </span>
            <span
              className={
                hoveredMessageId === message.id ? 'text-white' : 'text-gray-800'
              }
            >
              {message.title}
            </span>
          </div>
          <div className="text-gray-500">{message.sendDate}</div>
          <button
            className="ml-4 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(message.id)
            }}
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  )
}

export default MessageListPage
