import React, { useState, useEffect } from 'react'
import { fetchMessages, deleteMessage } from 'api/messageAPI'
import { useNavigate } from 'react-router-dom'
import Modal from '@/stories/organisms/Modal'

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
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages()
        setMessages(data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }

    loadMessages()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteMessage(id)
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      )
      setMessages(messages.filter((message) => message.id !== id))
      setModalOpen(true)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleMouseEnter = (id: number) => {
    setHoveredMessageId(id)
  }

  const handleMouseLeave = () => {
    setHoveredMessageId(null)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="mx-auto" style={{ marginLeft: '20%', marginRight: '20%' }}>
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
                className={`font-semibold ${
                  hoveredMessageId === message.id
                    ? 'text-white'
                    : 'text-red-500'
                }`}
              >
                {message.nickname}
              </span>
              <span
                className={`${
                  hoveredMessageId === message.id
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                {message.title}
              </span>
            </div>
            <div className="text-gray-500">{message.sendDate}</div>
            {hoveredMessageId === message.id && (
              <button
                className="ml-4 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(message.id)
                }}
              >
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
            {isModalOpen && (
        <Modal
          title="쪽지가 삭제되었습니다."
          content="쪽지가 성공적으로 삭제되었습니다."
          iconSrc="src.alert"
          onClose={closeModal}
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
          imgColor="#333"
          imgSize={100}
        />
      )}
    </div>
  )
}

export default MessageListPage
