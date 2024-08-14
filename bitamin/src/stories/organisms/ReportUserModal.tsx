import React, { useState, useEffect } from 'react'
import {
  fetchMessageDetail,
  deleteMessage,
  deleteReply,
  createReply,
} from 'api/messageAPI'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from '@/stories/organisms/Modal'
import CheckModal from '@/stories/organisms/CheckModal'
import ReportUserModal from './ReportUserModal'
import { RiDeleteBin6Line, RiAlertLine } from 'react-icons/ri'

const MessageDetailPage = () => {
  const { messageId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isMessageModalOpen, setMessageModalOpen] = useState(false)
  const [isMessageSendModalOpen, setMessageSendModalOpen] = useState(false)

  const [isCheckReplyModalOpen, setCheckReplyModalOpen] = useState(false)
  const [isCheckModalOpen, setCheckModalOpen] = useState(false)
  const [replyModalId, setReplyModalId] = useState(0)
  const [isReportModalOpen, setReportModalOpen] = useState(false) // 신고 모달 상태 추가

  const closeCheckModal = () => {
    setCheckModalOpen(false)
  }

  const handleConfirm = async () => {
    try {
      await deleteMessage(Number(messageId))
      setModalOpen(true)
    } catch (err) {
      alert('Failed to delete message')
      console.error('Error deleting message:', err)
    } finally {
      closeCheckModal()
    }
  }

  const handleSecondaryAction = () => {
    closeCheckModal()
  }

  const closeReplyCheckModal = () => {
    setCheckReplyModalOpen(false)
  }

  const handleReplyConfirm = async () => {
    deleteToReply(replyModalId)
    closeReplyCheckModal()
  }

  const handleReplySecondaryAction = () => {
    closeReplyCheckModal()
  }

  const closeModal = () => {
    setModalOpen(false)
    navigate('/messagelist')
  }

  const closeMessageModal = () => {
    setMessageModalOpen(false)
  }

  const closeSendMessageModal = () => {
    setMessageSendModalOpen(false)
  }

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
    setCheckModalOpen(true)
  }

  const handleDeleteReply = async (replyId) => {
    await setReplyModalId(replyId)
    setCheckReplyModalOpen(true)
  }

  const deleteToReply = async (replyId) => {
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
      setMessageModalOpen(true)
    } catch (err) {
      alert('Failed to delete reply')
      console.error('Error deleting reply:', err)
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

      const updatedMessage = await fetchMessageDetail(Number(messageId))
      setMessage(updatedMessage)

      setReplyContent('')
      setShowReplyInput(false)
      setMessageSendModalOpen(true)
    } catch (err) {
      alert('Failed to add reply')
      console.error('Error adding reply:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const isAdmin = message?.nickname === '관리자'

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
        <div className="flex items-center space-x-2">
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleDeleteMessage}
          >
            <RiDeleteBin6Line size={24} />
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-700"
            onClick={() => setReportModalOpen(true)} // 신고 모달 열기
          >
            <RiAlertLine size={24} />
          </button>
        </div>
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
              <RiDeleteBin6Line size={20} />
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

          {isMessageModalOpen && (
            <Modal
              title="댓글이 삭제 되었습니다."
              content="댓글이 성공적으로 삭제되었습니다."
              iconSrc="src.alert"
              onClose={closeMessageModal}
              headerBackgroundColor="#FF1B1B"
              buttonBorderColor="#FF1B1B"
              buttonTextColor="#FF1B1B"
              imgColor="#333"
              imgSize={100}
            />
          )}
        </div>
      )}

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

      {isMessageSendModalOpen && (
        <Modal
          title="답장이 전송되었습니다."
          content="답장이 성공적으로 전송되었습니다."
          iconSrc="ri.RiMailSendLine"
          onClose={closeSendMessageModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          imgColor="#333"
        />
      )}

      {isCheckModalOpen && (
        <CheckModal
          title="쪽지 삭제"
          content="정말 삭제하시겠습니까?"
          iconSrc="src.alert"
          confirmText="확인"
          onConfirm={handleConfirm}
          onClose={closeCheckModal}
          width="400px"
          height="300px"
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
          secondaryButtonText="취소"
          onSecondaryAction={handleSecondaryAction}
        />
      )}

      {isCheckReplyModalOpen && (
        <CheckModal
          title="답장 삭제"
          content="정말 삭제하시겠습니까?"
          iconSrc="src.alert"
          confirmText="확인"
          onConfirm={handleReplyConfirm}
          onClose={closeReplyCheckModal}
          width="400px"
          height="300px"
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
          secondaryButtonText="취소"
          onSecondaryAction={handleReplySecondaryAction}
        />
      )}

      {isReportModalOpen && (
        <ReportUserModal
          isOpen={isReportModalOpen}
          onRequestClose={() => setReportModalOpen(false)}
          respondentId={message?.senderId} // 신고 대상자의 ID를 전달
        />
      )}
    </div>
  )
}

export default MessageDetailPage
