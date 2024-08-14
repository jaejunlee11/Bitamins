import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchConsultationList,
  joinConsultation,
  useJoinRandomRoom,
} from 'store/useConsultationStore'
import { RoomSearch, Consultation, JoinConsultation } from 'ts/consultationType'
import CreateRoomModal from './CreateRoomModal'
import RandomConsultationModal from './RandomConsultationModal'
import PasswordModal from './PasswordModal'

const ConsultationListPa: React.FC = () => {
  const navigate = useNavigate()

  const { ConsultationList, fetchConsultations } = fetchConsultationList(
    (state) => ({
      ConsultationList: state.ConsultationList || { consultationList: [] },
      fetchConsultations: state.fetchConsultations,
    })
  )

  const { joinRoom, setJoinConsultation } = joinConsultation((state) => ({
    joinRoom: state.joinRoom,
    setJoinConsultation: state.setJoinConsultation,
  }))

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('전체')
  const { joinRandomRoom } = useJoinRandomRoom((state) => ({
    joinRandomRoom: state.joinRandomRoom,
  }))

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false)
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [visibleConsultations, setVisibleConsultations] = useState<number>(5)

  const loadConsultations = async (
    page: number,
    size: number,
    type: string
  ) => {
    const roomSearch: RoomSearch = {
      page,
      size,
      type,
    }
    try {
      await fetchConsultations(roomSearch)
    } catch (error) {
      setError('Failed to fetch consultations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConsultations(0, 100, selectedType)
  }, [selectedType])

  const handleJoinRoom = (consultation: Consultation) => {
    if (consultation.isPrivated) {
      setSelectedConsultation(consultation)
      setIsPasswordModalOpen(true)
    } else {
      joinRoomAndNavigate(consultation)
    }
  }

  const joinRoomAndNavigate = async (
    consultation: Consultation,
    password: string = ''
  ) => {
    try {
      const joinData: JoinConsultation = {
        id: consultation.id,
        isPrivated: consultation.isPrivated,
        password,
        startTime: consultation.startTime,
        sessionId: consultation.sessionId,
      }

      await joinRoom(joinData)
      setJoinConsultation(joinData)
      navigate('/consult')
    } catch (error) {
      setError('Failed to join the room')
      navigate('/consultationlist')
    }
  }

  const handlePasswordSubmit = async (password: string) => {
    if (selectedConsultation) {
      try {
        const joinData: JoinConsultation = {
          id: selectedConsultation.id,
          isPrivated: selectedConsultation.isPrivated,
          password,
          startTime: selectedConsultation.startTime,
          sessionId: selectedConsultation.sessionId,
        }

        await joinRoom(joinData)
        setJoinConsultation(joinData)
        setIsPasswordModalOpen(false)
        navigate('/consult')
      } catch (error) {
        setPasswordError('비밀번호가 틀렸습니다. 다시 시도해 주세요.')
        setIsPasswordModalOpen(true)
      }
    }
  }

  const handleJoinRandomRoom = async () => {
    try {
      await joinRandomRoom(selectedType)
    } catch (error) {
      setError('Failed to fetch random participants')
    }
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
  }

  const formatTime = (time: string): string => {
    const date = new Date(time)
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const openRandomModal = () => setIsRandomModalOpen(true)
  const closeRandomModal = () => setIsRandomModalOpen(false)

  const showMoreConsultations = () => {
    setVisibleConsultations((prev) => prev + 5)
  }

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="max-w-screen-lg mx-auto p-8 bg-pink-50 min-h-screen">
      <div className="flex justify-center space-x-4 mb-6">
        {['전체', '독서', '영화', '미술', '음악', '대화'].map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`py-2 px-4 rounded-full ${
              selectedType === type
                ? 'bg-orange-400 text-white'
                : 'bg-pink-100 text-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {ConsultationList.consultationList
          .slice(0, visibleConsultations)
          .map((consultation) => (
            <li
              key={consultation.id}
              className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    consultation.isPrivated
                      ? '../public/BItAMin.png'
                      : '../public/BItAMin.png'
                  }
                  alt={
                    consultation.isPrivated ? '비밀방 아이콘' : '일반방 아이콘'
                  }
                  className="w-6 h-6" // 이미지 크기를 조정하는 클래스
                />
                <span className="py-1 px-2 bg-pink-200 text-gray-700 rounded-full">
                  {consultation.category}
                </span>
                <span className="text-gray-700">
                  {formatTime(consultation.startTime)}
                </span>
                <span className="text-gray-700">{consultation.title}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {consultation.currentParticipants} / 5
                </span>
                <button
                  onClick={() => handleJoinRoom(consultation)}
                  className="py-2 px-4 bg-orange-400 text-white rounded-lg shadow"
                >
                  입장
                </button>
              </div>
            </li>
          ))}
      </ul>

      {visibleConsultations < ConsultationList.consultationList.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={showMoreConsultations}
            className="bg-orange-400 text-white py-2 px-4 rounded-lg"
          >
            더보기
          </button>
        </div>
      )}

      <div className="flex justify-center mt-10">
        <button
          onClick={openModal}
          className="bg-pink-100 p-4 rounded-lg text-gray-700 hover:bg-pink-200 transition"
        >
          <i className="fas fa-plus-circle mr-2"></i> 새로운 방을 생성하세요
        </button>
      </div>

      <p className="text-center text-gray-500 mt-4">
        어디로 들어가야 할 지 모르겠다면?{' '}
        <span
          className="text-orange-400 underline cursor-pointer"
          onClick={openRandomModal}
        >
          click here !
        </span>
      </p>

      {isModalOpen && <CreateRoomModal onClose={closeModal} />}
      {isRandomModalOpen && (
        <RandomConsultationModal
          isOpen={isRandomModalOpen}
          onClose={closeRandomModal}
          onJoin={handleJoinRandomRoom}
        />
      )}
      {isPasswordModalOpen && (
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
        />
      )}
    </div>
  )
}

export default ConsultationListPa
