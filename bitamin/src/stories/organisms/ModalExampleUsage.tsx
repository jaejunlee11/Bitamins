import React, { useState } from 'react'
import Modal from './Modal.tsx'

const ModalExampleUsage: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<string | null>(null)

  const openModal = (type: string) => () => setModalOpen(type)
  const closeModal = () => setModalOpen(null)

  return (
    <div>
      <button onClick={openModal('createRoom')}>방 생성 모달 열기</button>
      <button onClick={openModal('passwordChange')}>
        비밀번호 변경 모달 열기
      </button>
      <button onClick={openModal('sendMessage')}>쪽지 전송 모달 열기</button>
      <button onClick={openModal('report')}>신고 접수 모달 열기</button>
      <button onClick={openModal('deleteMessage')}>쪽지 삭제 모달 열기</button>
      <button onClick={openModal('deleteReply')}>댓글 삭제 모달 열기</button>
      <button onClick={openModal('signupComplete')}>
        회원가입 완료 모달 열기
      </button>
      <button onClick={openModal('privacyUpdate')}>
        개인정보 수정 모달 열기
      </button>

      {isModalOpen === 'createRoom' && (
        <Modal
          title="방이 생성되었습니다."
          content="방이 성공적으로 생성되었습니다."
          iconSrc="Group 373.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
        />
      )}

      {isModalOpen === 'passwordChange' && (
        <Modal
          title="비밀번호 변경"
          content="비밀번호가 성공적으로 변경되었습니다."
          iconSrc="edit-contained.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
        />
      )}

      {isModalOpen === 'sendMessage' && (
        <Modal
          title="쪽지가 전송되었습니다."
          content="쪽지가 성공적으로 전송되었습니다."
          iconSrc="send-02.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
        />
      )}

      {isModalOpen === 'report' && (
        <Modal
          title="신고 접수"
          content="신고가 성공적으로 접수되었습니다."
          iconSrc="alert-triangle.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
        />
      )}

      {isModalOpen === 'deleteMessage' && (
        <Modal
          title="쪽지가 삭제되었습니다."
          content="쪽지가 성공적으로 삭제되었습니다."
          iconSrc="alert-triangle.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
        />
      )}

      {isModalOpen === 'deleteReply' && (
        <Modal
          title="댓글이 삭제 되었습니다."
          content="댓글이 성공적으로 삭제되었습니다."
          iconSrc="alert-triangle.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF1B1B"
          buttonBorderColor="#FF1B1B"
          buttonTextColor="#FF1B1B"
        />
      )}

      {isModalOpen === 'signupComplete' && (
        <Modal
          title="회원가입 완료"
          content="회원가입이 성공적으로 완료되었습니다."
          iconSrc="edit-contained.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
        />
      )}

      {isModalOpen === 'privacyUpdate' && (
        <Modal
          title="개인정보 수정"
          content="개인정보가 성공적으로 수정되었습니다."
          iconSrc="edit-contained.svg"
          onClose={closeModal}
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
        />
      )}
    </div>
  )
}

export default ModalExampleUsage
