import { Client, Frame, Message } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import useAuthStore from 'store/useAuthStore'

export class WebSocketService {
  private client: Client

  constructor() {
    const { accessToken } = useAuthStore.getState()
    this.client = new Client({
      brokerURL: 'ws://i11b105.p.ssafy.io/ws', // SockJS 사용 시 undefined로 설정

      // Authorization 헤더를 connectHeaders에 추가
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str: string) => {
        console.log(new Date(), str)
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // webSocketFactory: () => {
      //   return new SockJS('/ws') // SockJS를 사용하여 WebSocket 연결을 설정
      // },
      // webSocketFactory: () => {
      //   return new SockJS('wss://i11b105.p.ssafy.io/ws') // 정확한 SockJS URL 설정
      // },
    })

    this.client.onConnect = (frame: Frame) => {
      console.log('WebSocket 서버에 연결됨:', frame)
    }

    this.client.onStompError = (frame: Frame) => {
      console.error('Broker에서 오류를 보고했습니다:', frame.headers['message'])
      console.error('추가 세부 사항:', frame.body)
    }
  }

  public activate() {
    console.log('activate됨????????')
    if (!this.client.active) {
      this.client.activate()
    }
  }

  public deactivate() {
    if (this.client.active) {
      this.client.deactivate()
    }
  }

  public subscribeToTopic(topic: string, callback: (message: any) => void) {
    if (!this.client.connected) {
      console.error('STOMP 연결이 설정되지 않았습니다. 구독할 수 없습니다.')
      return
    }

    this.client.subscribe(topic, (message: Message) => {
      const parsedMessage = JSON.parse(message.body)
      console.log('서버에서 받은 메시지:', parsedMessage)
      callback(parsedMessage)
    })
  }
}
