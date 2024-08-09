import React, { useState } from 'react'
import useConsultationStore from 'store/useConsultationStore'

const Chat: React.FC = () => {
  const [message, setMessage] = useState('')
  const { session, myUserName, messages, addMessage } = useConsultationStore(
    (state) => ({
      session: state.session,
      myUserName: state.myUserName,
      messages: state.messages,
      addMessage: state.addMessage,
    })
  )

  const handleSend = () => {
    if (session && message) {
      session.signal({
        data: `${myUserName}%/%${message}`,
        to: [],
        type: 'chat',
      })
      addMessage({ user: myUserName, content: message })
      setMessage('')
    }
  }

  return (
    <div>
      <div>
        <h2>Chat</h2>
        <div>
          {messages.map((msg, i) => (
            <div key={i}>
              <strong>{msg.user}: </strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default Chat
