import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom, joinRoom } from 'api/consultationAPI'
import useConsultationStore from 'store/useConsultationStore'

const CreateRoomPage: React.FC = () => {
  const [category, setCategory] = useState('미술')
  const [title, setTitle] = useState('')
  const [isPrivated, setIsPrivated] = useState(0)
  const [password, setPassword] = useState('')
  const [startTime, setStartTime] = useState('')
  const setParticipant = useConsultationStore((state) => state.setParticipant)
  const setRoomData = useConsultationStore((state) => state.setRoomData)
  const setJoinData = useConsultationStore((state) => state.setJoinData)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const startDateTime = new Date(startTime)
      const endDateTime = new Date(
        startDateTime.getTime() + 24 * 14 * 60 * 60 * 1000
      ) // 2시간 후

      const roomData = {
        category,
        title,
        isPrivated,
        password: isPrivated ? password : null,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      }

      const response = await createRoom(roomData)
      console.log('Create Room Response:', response) // 응답 데이터 확인
      setRoomData(roomData)

      const joinData = {
        id: response.id, // 수정된 부분
        isPrivated: response.isPrivated,
        password: response.password,
        startTime: response.startTime,
        sessionId: response.sessionId,
        token: response.token,
      }

      console.log('Join Data:', joinData) // joinData 확인

      const joinResponse = await joinRoom(joinData) // 자동으로 참여 요청
      console.log('Join Room Response:', joinResponse) // 응답 데이터 확인
      setJoinData(joinData)
      setParticipant(joinResponse.data) // zustand 스토어에 저장
      alert('Room created and joined successfully!')
      navigate('/consultationlist')
    } catch (error) {
      alert('Failed to create or join room')
      console.error('Error creating or joining room:', error)
    }
  }

  return (
    <div>
      <h1>Create Room</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Private Room</label>
          <select
            value={isPrivated}
            onChange={(e) => setIsPrivated(Number(e.target.value))}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>
        {isPrivated === 1 && (
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={isPrivated === 1}
            />
          </div>
        )}
        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  )
}

export default CreateRoomPage
