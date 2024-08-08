import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  joinRoom,
  joinRandomParticipants,
  fetchConsultations,
} from 'api/consultationAPI'
import {
  OpenVidu,
  Publisher,
  Session,
  StreamManager,
  Device,
} from 'openvidu-browser'

interface Consultation {
  id: number
  category: string
  title: string
  isPrivated: boolean
  startTime: string
  endTime: string
  currentParticipants: number
  sessionId: string
}

interface Participant {
  consultationId: number
  token: string
  id: number
  memberId: number
  nickname: string
  profileKey: string
  profileUrl: string
}

interface RoomData {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}

interface JoinData {
  id: number
  isPrivated: boolean
  password: string | null
  startTime: string
  sessionId: string
}

interface JoinResponseData {
  token: string
  sessionId: string
}

interface ConsultationState {
  consultations: Consultation[]
  participant: Participant | null
  roomData: RoomData | null
  joinData: JoinData | null
  joinResponseData: JoinResponseData | null // JoinResponse 데이터 추가
  totalPages: number
  page: number
  size: number
  totalElements: number
  mySessionId: string
  myUserName: string
  subscribers: StreamManager[]
  session?: Session
  publisher?: Publisher
  mainStreamManager?: StreamManager
  currentVideoDevice?: Device
  fetchAndSetConsultations: (
    page: number,
    size: number,
    type: string
  ) => Promise<void>
  joinRoomAndSetState: (joinData: JoinData) => Promise<void>
  joinRandomParticipantsAndSetState: (type: string) => Promise<void>
  setParticipant: (participant: Participant) => void
  setRoomData: (roomData: RoomData) => void
  setJoinData: (joinData: JoinData) => void
  setJoinResponseData: (joinResponseData: JoinResponseData) => void // JoinResponse 데이터 설정 함수 추가
  initializeOpenViduSession: (session: Session) => void
  addSubscriber: (subscriber: StreamManager) => void
  removeSubscriber: (subscriber: StreamManager) => void
}

const useConsultationStore = create<ConsultationState>()(
  persist(
    (set, get) => ({
      consultations: [],
      participant: null,
      roomData: null,
      joinData: null,
      joinResponseData: null, // 초기 값 설정
      totalPages: 0,
      page: 0,
      size: 10,
      totalElements: 0,
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      subscribers: [],
      fetchAndSetConsultations: async (
        page: number,
        size: number,
        type: string
      ) => {
        try {
          const data = await fetchConsultations(page, size, type)
          if (data && data.consultationList) {
            set({
              consultations: data.consultationList,
              totalPages: data.totalPages,
              page: data.page,
              size: data.size,
              totalElements: data.totalElements,
            })
          } else {
            console.error('Unexpected API response structure:', data)
            throw new Error('Unexpected API response structure')
          }
        } catch (error) {
          console.error('Failed to fetch consultations:', error)
          throw new Error('Failed to fetch consultations')
        }
      },
      joinRoomAndSetState: async (joinData: JoinData) => {
        try {
          const response = await joinRoom(joinData)
          set({ joinData: { ...joinData, token: response.token } })
          set({
            joinResponseData: {
              token: response.token,
              sessionId: response.sessionId,
            },
          }) // JoinResponse 데이터를 스토어에 저장
          const OV = new OpenVidu()
          const session = OV.initSession()
          get().initializeOpenViduSession(session)
        } catch (error) {
          console.error('Failed to join room:', error)
          throw new Error('Failed to join room')
        }
      },
      joinRandomParticipantsAndSetState: async (type: string) => {
        try {
          const response = await joinRandomParticipants(type)
          const { sessionid, token } = response
          set({ joinData: { ...get().joinData, sessionId: sessionid, token } })
          set({ joinResponseData: { token, sessionId: sessionid } }) // JoinResponse 데이터를 스토어에 저장
          const OV = new OpenVidu()
          const session = OV.initSession()
          get().initializeOpenViduSession(session)
        } catch (error) {
          console.error('Failed to fetch random participants:', error)
          throw new Error('Failed to fetch random participants')
        }
      },
      initializeOpenViduSession: (session: Session) => {
        set({ session })
        session.on('streamCreated', (event) => {
          const subscriber = session.subscribe(event.stream, undefined)
          get().addSubscriber(subscriber)
        })

        session.on('streamDestroyed', (event) => {
          get().removeSubscriber(event.stream.streamManager)
        })

        session.on('exception', (exception) => {
          console.warn(exception)
        })

        const { joinData, myUserName } = get()
        session
          .connect(joinData!.token, { clientData: myUserName })
          .then(async () => {
            const publisher = await session.initPublisherAsync(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: true,
              publishVideo: true,
              resolution: '640x480',
              frameRate: 30,
              insertMode: 'APPEND',
              mirror: false,
            })

            session.publish(publisher)
            set({ publisher, mainStreamManager: publisher })

            const devices = await session.openvidu.getDevices()
            const videoDevices = devices.filter(
              (device) => device.kind === 'videoinput'
            )
            const currentVideoDeviceId = publisher.stream
              .getMediaStream()
              .getVideoTracks()[0]
              .getSettings().deviceId!
            const currentVideoDevice = videoDevices.find(
              (device) => device.deviceId === currentVideoDeviceId
            )

            set({ currentVideoDevice })
          })
          .catch((error) => {
            console.log(
              'There was an error connecting to the session:',
              error.code,
              error.message
            )
          })
      },
      addSubscriber: (subscriber: StreamManager) =>
        set((state) => ({ subscribers: [...state.subscribers, subscriber] })),
      removeSubscriber: (subscriber: StreamManager) =>
        set((state) => ({
          subscribers: state.subscribers.filter((sub) => sub !== subscriber),
        })),
      setParticipant: (participant: Participant) => set({ participant }),
      setRoomData: (roomData: RoomData) => set({ roomData }),
      setJoinData: (joinData: JoinData) => set({ joinData }),
      setJoinResponseData: (joinResponseData: JoinResponseData) =>
        set({ joinResponseData }), // JoinResponse 데이터 설정 함수 추가
    }),
    {
      name: 'consultation-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        consultations: state.consultations,
        participant: state.participant,
        roomData: state.roomData,
        joinData: state.joinData,
        joinResponseData: state.joinResponseData,
        totalPages: state.totalPages,
        page: state.page,
        size: state.size,
        totalElements: state.totalElements,
        mySessionId: state.mySessionId,
        myUserName: state.myUserName,
        subscribers: state.subscribers,
      }),
    }
  )
)

export default useConsultationStore
