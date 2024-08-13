import React, { useState } from 'react'
import Modal from 'react-modal'
import 'styles/organisms/ModalExample.css' // 추가 스타일을 위해 CSS 파일을 사용합니다.

Modal.setAppElement('#root') // 접근성을 위해 모달을 렌더링하는 엘리먼트를 설정합니다.

const ModalExample: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Hello</h2>
        <button onClick={closeModal}>Close Modal</button>
        <div>I am a modal</div>
      </Modal>
    </div>
  )
}

export default ModalExample
