import React, { useEffect, useState } from 'react'
import {
  fetchMessageDetail,
  deleteMessage,
  deleteReply,
  createReply,
} from 'api/messageAPI'
import { useParams, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    const loadMessageDetail = async () => {
      try {
        const messageData = await fetchMessageDetail(Number(messageId))
        setMessage(messageData)
      } catch (err) {
        setError('Failed to fetch message details')
      } finally {
        setLoading(false)
      }
    }

    loadMessageDetail()
  }, [messageId])

  const handleDeleteMessage = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(Number(messageId))
        alert('Message deleted successfully')
        navigate('/messagelist')
      } catch (err) {
        alert('Failed to delete message')
        console.error('Error deleting message:', err)
      }
    }
  }

  const handleDeleteReply = async (replyId: number) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await deleteReply(replyId)
        setMessage((prevMessage) => {
          if (prevMessage) {
            return {
              ...prevMessage,
              replies: prevMessage.replies.filter(
                (reply) => reply.id !== replyId
              ),
            }
          }
          return prevMessage
        })
        alert('Reply deleted successfully')
      } catch (err) {
        alert('Failed to delete reply')
        console.error('Error deleting reply:', err)
      }
    }
  }

  const handleCreateReply = async () => {
    if (replyContent.trim() === '') {
      alert('Reply content cannot be empty')
      return
    }

    try {
      // 새로운 답글 생성
      const newReply = await createReply(Number(messageId), {
        content: replyContent,
      })

      // 답글이 성공적으로 추가되었음을 알림
      alert('Reply added successfully')

      // 메시지를 다시 로딩하여 최신 데이터를 가져옴
      const updatedMessage = await fetchMessageDetail(Number(messageId))
      setMessage(updatedMessage)

      // 입력 필드 초기화
      setReplyContent('')
    } catch (err) {
      alert('Failed to add reply')
      console.error('Error adding reply:', err)
    }
  }

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
          <button onClick={handleDeleteMessage}>Delete Message</button>
          <h2>Replies</h2>
          <ul>
            {message.replies.map((reply, index) => (
              <li key={reply.id}>
                <p>
                  <strong>{reply.memberNickName}:</strong> {reply.content}
                </p>
                <p>
                  <small>{new Date(reply.sendDate).toLocaleString()}</small>
                </p>
                <p>{reply.isRead ? 'Read' : 'Unread'}</p>
                {index === message.replies.length - 1 && (
                  <button onClick={() => handleDeleteReply(reply.id)}>
                    Delete Reply
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div>
            <h3>Add a Reply</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply here"
            />
            <button onClick={handleCreateReply}>Add Reply</button>
          </div>
        </div>
      ) : (
        <div>No message details available</div>
      )}
    </div>
  )
}

export default MessageDetailPage
