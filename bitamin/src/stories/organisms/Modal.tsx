import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContainer = styled.div<{ width?: string; height?: string }>`
  position: relative;
  background-color: #fff;
  border-radius: 23px;
  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
  width: ${({ width }) => width || '28.25rem'};
  height: ${({ height }) => height || '18.938rem'};
  overflow: hidden;
`

const ModalHeader = styled.div<{ backgroundColor?: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor || '#ff713c'};
  height: 2.25rem;
  border-radius: 23px 23px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalTitle = styled.b`
  color: #fff;
  font-size: 1.25rem;
`

const ModalContent = styled.div`
  padding: 1rem;
  text-align: center;
  color: #333;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`

const ModalButton = styled.button<{ borderColor?: string; textColor?: string }>`
  background-color: #fff;
  border: 1px solid ${({ borderColor }) => borderColor || '#ff713c'};
  color: ${({ textColor }) => textColor || '#ff713c'};
  border-radius: 5px;
  padding: 0.75rem;
  cursor: pointer;
`

interface ModalProps {
  title: string
  content: string
  iconSrc?: string
  confirmText?: string
  onConfirm?: () => void
  onClose: () => void
  width?: string
  height?: string
  headerBackgroundColor?: string
  buttonBorderColor?: string
  buttonTextColor?: string
}

const Modal: FunctionComponent<ModalProps> = ({
  title,
  content,
  iconSrc,
  confirmText = '확인',
  onConfirm,
  onClose,
  width,
  height,
  headerBackgroundColor,
  buttonBorderColor,
  buttonTextColor,
}) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer
        width={width}
        height={height}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader backgroundColor={headerBackgroundColor}>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalContent>
          {iconSrc && <img src={iconSrc} alt="" />}
          <p>{content}</p>
        </ModalContent>
        <ModalFooter>
          <ModalButton
            borderColor={buttonBorderColor}
            textColor={buttonTextColor}
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </ModalButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default Modal
