import React, { useState, useEffect } from 'react'
import {
  fetchMessageDetail,
  deleteMessage,
  deleteReply,
  createReply,
} from 'api/messageAPI'
import { useParams, useNavigate } from 'react-router-dom'

const MessageDetailPage = () => {
  const { messageId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)

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

  const handleDeleteReply = async (replyId) => {
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
      const newReply = await createReply(Number(messageId), {
        content: replyContent,
      })

      alert('Reply added successfully')

      const updatedMessage = await fetchMessageDetail(Number(messageId))
      setMessage(updatedMessage)

      setReplyContent('')
      setShowReplyInput(false)
    } catch (err) {
      alert('Failed to add reply')
      console.error('Error adding reply:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const isAdmin = message?.nickname === '관리자'

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={handleDeleteMessage}
        >
          삭제
        </button>
        {/* 신고 버튼 주석 처리 */}
        {/* <button className="bg-yellow-500 text-white px-3 py-1 rounded">
          신고
        </button> */}
        <span className="text-gray-500">{message?.sendDate}</span>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold">{message?.title}</h1>
        <p className="text-gray-700">
          <strong>카테고리:</strong> {message?.category}
        </p>
        {message?.counselingDate && (
          <p className="text-gray-700">
            <strong>컨설팅 예약 시간:</strong> {message.counselingDate}
          </p>
        )}
        <p className="text-gray-800 mt-4">{message?.content}</p>
      </div>

      <div className="space-y-4">
        {message?.replies.map((reply) => (
          <div
            key={reply.id}
            className="flex items-start p-4 rounded-lg border bg-gray-100"
          >
            <img
              src="/path/to/profile-image.png"
              alt="Profile"
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
              <span className="font-semibold">{reply.memberNickName}</span>
              <p className="text-gray-700">{reply.content}</p>
              <small className="text-gray-500">{reply.sendDate}</small>
            </div>
            <button
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDeleteReply(reply.id)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {!isAdmin && (
        <div className="mt-6">
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showReplyInput ? '답글 숨기기' : '답글 작성하기'}
          </button>
          {showReplyInput && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 작성하세요"
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
              <button
                onClick={handleCreateReply}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                답글 추가
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MessageDetailPage
