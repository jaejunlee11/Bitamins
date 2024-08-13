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
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({})
  const [selectedType, setSelectedType] = useState<string>('전체')
  const [currentPage, setCurrentPage] = useState<number>(0) // 현재 페이지 상태 추가
  const [totalPages, setTotalPages] = useState<number>(1) // 전체 페이지 수 상태 추가
  const { joinRandomRoom } = useJoinRandomRoom((state) => ({
    joinRandomRoom: state.joinRandomRoom,
  }))

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false)

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
      setTotalPages(Math.ceil(ConsultationList.consultationList.length / size)) // 총 페이지 수 계산
    } catch (error) {
      setError('Failed to fetch consultations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ConsultationList.consultationList.length > 0) {
      setTotalPages(Math.ceil(ConsultationList.consultationList.length / 10)) // totalPages를 여기서 계산
    }
  }, [ConsultationList.consultationList.length])

  useEffect(() => {
    loadConsultations(currentPage, 100, selectedType)
  }, [selectedType, currentPage])

  const handlePasswordChange = (consultationId: number, value: string) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [consultationId]: value,
    }))
  }

  const handleJoinRoom = async (consultation: Consultation) => {
    try {
      const joinData = {
        id: consultation.id,
        isPrivated: consultation.isPrivated,
        password: passwords[consultation.id] || '',
        startTime: consultation.startTime,
        sessionId: consultation.sessionId,
      }

      const consult: JoinConsultation = await joinRoom(joinData)
      setJoinConsultation(consult)
      navigate('/consult')
    } catch (error) {
      setError('Failed to join the room')
      navigate('/consultationlist')
    }
  }

  const handleJoinRandomRoom = async (type: string) => {
    try {
      await joinRandomRoom(type)
    } catch (error) {
      setError('Failed to fetch random participants')
    }
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setCurrentPage(0) // 타입이 변경될 때 페이지를 초기화
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const openRandomModal = () => setIsRandomModalOpen(true)
  const closeRandomModal = () => setIsRandomModalOpen(false)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
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
          .slice(currentPage * 10, (currentPage + 1) * 10)
          .map((consultation: Consultation) => (
            <li
              key={consultation.id}
              className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <span className="py-1 px-2 bg-pink-200 text-gray-700 rounded-full">
                  {consultation.category}
                </span>
                <span className="text-gray-700">{consultation.startTime}</span>
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

      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`py-2 px-4 bg-pink-100 text-gray-700 rounded-lg shadow ${
            currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentPage === 0}
        >
          이전 페이지
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`py-2 px-4 bg-pink-100 text-gray-700 rounded-lg shadow ${
            currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentPage >= totalPages - 1}
        >
          다음 페이지
        </button>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={openModal}
          className="bg-pink-100 p-4 rounded-lg text-gray-700 hover:bg-pink-200 transition"
        >
          <i className="fas fa-plus-circle mr-2"></i>새로운 방을 생성하세요
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
    </div>
  )
}

export default ConsultationListPa
