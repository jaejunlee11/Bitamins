import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from 'react-icons/fi';

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
`;

// 중간 컴포넌트를 사용하여 props 필터링
const StyledModalContainer = styled(({ width, height, ...props }) => <div {...props} />)<{ width?: string; height?: string }>`
  position: relative;
  background-color: #fff;
  border-radius: 23px;
  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
  width: ${({ width }) => width || '28.25rem'};
  height: ${({ height }) => height || '18.938rem'};
  overflow: hidden;
`;

// 중간 컴포넌트를 사용하여 props 필터링
const StyledModalHeader = styled(({ backgroundColor, ...props }) => <div {...props} />)<{ backgroundColor?: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor || '#ff713c'};
  height: 2.25rem;
  border-radius: 23px 23px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.b`
  color: #fff;
  font-size: 1.25rem;
`;

const ModalContent = styled.div`
  padding: 1rem;
  text-align: center;
  color: #ff713c;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ModalButton = styled.button`
  background-color: #fff;
  border-radius: 5px;
  padding: 0.75rem;
  cursor: pointer;
  width: 150px;
`;



// props를 스타일링에만 사용하도록 처리
const StyledModalButton = styled(({ borderColor, textColor, ...props }) => <ModalButton {...props} />)`
  border: 1px solid ${({ borderColor }) => borderColor || '#ff713c'};
  color: ${({ textColor }) => textColor || '#ff713c'};
`;

// props를 스타일링에만 사용하도록 처리
const StyledModalContent = styled(({ textColor, ...props }) => <ModalContent {...props} />)`
  color: ${({ textColor }) => textColor || '#ff713c'};
`;

interface ModalProps {
  title: string;
  content: string;
  iconSrc?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  width?: string;
  height?: string;
  headerBackgroundColor?: string;
  buttonBorderColor?: string;
  buttonTextColor?: string;
  imgSize?:number;
  imgColor?:string;
}

const getIconComponent = (iconSrc: string,size:number) => {
  const [library, iconName] = iconSrc.split('.');
  console.log(`Library: ${library}, Icon Name: ${iconName}`);
  if (library === 'ri') {
    return RiIcons[iconName];
  } else if (library === 'fi') {
    return FiIcons[iconName];
  } else if (library === 'src') {
    console.log(`public/${iconName}.png`)
    return (props: any) => <img src={`/src/assets/image/${iconName}.png`} width={size} {...props} />;
  }
  return null;
};

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
  imgSize=100,
  imgColor,
}) => {
  const IconComponent = iconSrc ? getIconComponent(iconSrc,imgSize) : null;

  return (
    <ModalOverlay onClick={onClose}>
      <StyledModalContainer width={width} height={height} onClick={(e) => e.stopPropagation()}>
        <StyledModalHeader backgroundColor={headerBackgroundColor}>
          <ModalTitle>{title}</ModalTitle>
        </StyledModalHeader>
        <StyledModalContent
        textColor={buttonTextColor}
          >
          <IconContainer>
            {IconComponent && <IconComponent size={imgSize} color={imgColor} />}
          </IconContainer>
          <p>{content}</p>
        </StyledModalContent>
        <ModalFooter>
          <StyledModalButton
            borderColor={buttonBorderColor}
            textColor={buttonTextColor}
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </StyledModalButton>
        </ModalFooter>
      </StyledModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
