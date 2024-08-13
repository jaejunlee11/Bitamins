import React, { useState } from 'react'
import { createMessage } from 'api/messageAPI'
import Modal from '@/stories/organisms/Modal'

interface MessageModalProps {
  participant: {
    memberId: number
    memberNickname: string
  }
  onClose: () => void
}

const MessageModal: React.FC<MessageModalProps> = ({
  participant,
  onClose,
}) => {
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  const closeModal = () => {
    setModalOpen(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMessage({
      receiverId: participant.memberId,
      category,
      title,
      content,
      counselingDate: new Date().toISOString(),
    })
    setModalOpen(true)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {participant.memberNickname}에게 메시지 보내기
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">카테고리</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              전송
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          title="쪽지가 전송되었습니다."
          content="쪽지가 성공적으로 전송되었습니다."
          iconSrc="ri.RiMailSendLine"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          imgColor="#333"
        />
      )}
    </div>
  )
}

export default MessageModal
