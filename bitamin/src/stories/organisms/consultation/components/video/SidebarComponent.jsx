import React from 'react'
import ChatComponent from '../chat/ChatComponent'

const SidebarComponent = ({ participants, onParticipantAction, localUser }) => {
  return (
    <div className="w-64 p-4 bg-gray-100 border-l border-gray-300 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4">참여자 리스트</h3>
        <ul className="space-y-2">
          {participants.map((participant, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{participant.nickname}</span>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => onParticipantAction(participant)}
              >
                신고
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4">채팅</h3>
        <div className="h-64 overflow-y-auto bg-gray-200 p-2 rounded">
          <ChatComponent
            user={localUser}
            chatDisplay="block" // Sidebar에서는 항상 채팅을 표시
            close={() => {}} // Sidebar에서는 close 기능을 사용하지 않음
            messageReceived={() => {}} // 메시지 알림 처리
          />
        </div>
      </div>
    </div>
  )
}

export default SidebarComponent
