import styles from 'styles/message/MessageListPage.module.css'
import React, { useState, useCallback } from 'react'

import MessageListPage from 'stories/organisms/MessageListPage'
import ParticipantListPage from 'stories/organisms/ParticipantListPage'

const MessageListMainPage: React.FC = () => {
  const onFrameContainerClick = useCallback(() => {
    // Add your code here
  }, [])
  const [activeTab, setActiveTab] = useState('messages')

  return (
    <>
      <div className="p-4 mx-auto max-w-screen-lg">
        {' '}
        {/* 추가된 클래스 */}
        <div className="p-4 mx-auto" style={{ maxWidth: '60%' }}>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'messages' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            쪽지함
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'participants' ? 'bg-gray-300' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('participants')}
          >
            같이 한 사람
          </button>
        </div>
        {activeTab === 'messages' && <MessageListPage />}
        {activeTab === 'participants' && <ParticipantListPage />}
      </div>
    </>
  )
}

export default MessageListMainPage
