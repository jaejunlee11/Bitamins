import { OpenVidu } from 'openvidu-browser'
import React, { Component } from 'react'
import { withNavigate } from './withNavigate' // withNavigate 사용
import ChatComponent from './chat/ChatComponent'
import DialogExtensionComponent from './dialog-extension/DialogExtension'
import StreamComponent from './stream/StreamComponent'
import './VideoRoomComponent.css'
import OpenViduLayout from '../layout/openvidu-layout'
import UserModel from '../models/user-model'
import ToolbarComponent from './toolbar/ToolbarComponent'
import useUserStore from '../../../../store/useUserStore'
import { joinConsultation } from '../../../../store/useConsultationStore'
import ConfirmLeaveModal from './ConfirmLeaveModal' // 모달 컴포넌트
import { useChatStore } from '../../../../store/useChatStore' // ChatStore 추가

var localUser = new UserModel()

class VideoRoomComponent extends Component {
  constructor(props) {
    super(props)

    this.hasBeenUpdated = false
    this.layout = new OpenViduLayout()

    const { sessionId, token, consultationId } =
      joinConsultation.getState().joinconsultation || {} // zustand에서 sessionId와 token 상태 가져오기
    const { nickname } = useUserStore.getState().user || {} // zustand에서 nickname 상태 가져오기

    this.state = {
      mySessionId: sessionId || 'SessionA',
      myUserName: nickname || 'test5',
      session: undefined,
      localUser: undefined,
      subscribers: [], // remotes 대신 subscribers로 초기화
      chatDisplay: 'none',
      currentVideoDevice: undefined,
      token: token,
      showModal: false, // 모달 표시 여부 상태
      consultationId: consultationId,
      participants: [], // 참여자 리스트 상태 추가
    }

    this.joinSession = this.joinSession.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.onbeforeunload = this.onbeforeunload.bind(this)
    this.updateLayout = this.updateLayout.bind(this)
    this.camStatusChanged = this.camStatusChanged.bind(this)
    this.micStatusChanged = this.micStatusChanged.bind(this)
    this.nicknameChanged = this.nicknameChanged.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.screenShare = this.screenShare.bind(this)
    this.stopScreenShare = this.stopScreenShare.bind(this)
    this.closeDialogExtension = this.closeDialogExtension.bind(this)
    this.toggleChat = this.toggleChat.bind(this)
    this.checkNotification = this.checkNotification.bind(this)
    this.checkSize = this.checkSize.bind(this)
    this.handleConfirmLeave = this.handleConfirmLeave.bind(this) // 모달 확인 버튼 핸들러
    this.handleCancelLeave = this.handleCancelLeave.bind(this) // 모달 취소 버튼 핸들러
  }

  componentDidMount() {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: false,
      bigClass: 'OV_big',
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    }

    this.layout.initLayoutContainer(
      document.getElementById('layout'),
      openViduLayoutOptions
    )
    window.addEventListener('beforeunload', this.onbeforeunload)
    window.addEventListener('resize', this.updateLayout)
    window.addEventListener('resize', this.checkSize)
    this.joinSession()

    console.log('Joining session with ID:', this.state.mySessionId)
    console.log('Using token:', this.state.token)
    this.startStt()
  }

  componentDidUpdate(prevProps, prevState) {
    // participants 상태가 업데이트될 때마다 로그 출력
    if (prevState.participants !== this.state.participants) {
      console.log('Participants updated:', this.state.participants)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload)
    window.removeEventListener('resize', this.updateLayout)
    window.removeEventListener('resize', this.checkSize)
    this.leaveSession()
  }

  onbeforeunload(event) {
    this.setState({ showModal: true }) // 페이지 떠나기 전 모달 표시
    event.preventDefault() // 브라우저의 기본 동작 막기
    event.returnValue = '' // 브라우저의 기본 경고 메시지 표시
  }

  joinSession() {
    this.OV = new OpenVidu()

    this.setState(
      {
        session: this.OV.initSession(),
      },
      async () => {
        this.subscribeToStreamCreated()
        await this.connectToSession()
      }
    )
  }

  async connectToSession() {
    const token = this.state.token

    if (token != null) {
      console.log('Token received from store: ', token)
      this.connect(token) // 스토어에서 가져온 토큰으로 연결
    } else {
      console.error('No token found in consultation state.')
      alert('Failed to connect: No token found.')
    }
  }

  connect(token) {
    this.state.session
      .connect(token, { clientData: this.state.myUserName })
      .then(() => {
        this.connectWebCam()
      })
      .catch((error) => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            messgae: error.message,
            code: error.code,
            status: error.status,
          })
        }

        alert('There was an error connecting to the session:', error.message)
        console.log(
          'There was an error connecting to the session:',
          error.code,
          error.message
        )
      })
  }

  async connectWebCam() {
    await this.OV.getUserMedia({
      audioSource: undefined,
      videoSource: undefined,
    })
    var devices = await this.OV.getDevices()
    var videoDevices = devices.filter((device) => device.kind === 'videoinput')

    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    })

    if (this.state.session.capabilities.publish) {
      publisher.on('accessAllowed', () => {
        this.state.session.publish(publisher).then(() => {
          this.updateSubscribers()
          this.localUserAccessAllowed = true
          if (this.props.joinSession) {
            this.props.joinSession()
          }
        })
      })
    }
    localUser.setNickname(this.state.myUserName)
    localUser.setConnectionId(this.state.session.connection.connectionId)
    localUser.setScreenShareActive(false)
    localUser.setStreamManager(publisher)
    this.addParticipant(localUser) // 참여자 리스트에 로컬 유저 추가
    this.subscribeToUserChanged()
    this.subscribeToStreamDestroyed()
    this.sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    })

    this.setState(
      { currentVideoDevice: videoDevices[0], localUser: localUser },
      () => {
        this.state.localUser.getStreamManager().on('streamPlaying', (e) => {
          this.updateLayout()
          publisher.videos[0].video.parentElement.classList.remove(
            'custom-class'
          )
        })
        this.addParticipant(localUser) // 로컬 사용자 참여자 리스트에 추가
      }
    )
  }

  updateSubscribers() {
    this.setState(
      {
        subscribers: [...this.state.subscribers],
      },
      () => {
        if (this.state.localUser) {
          this.sendSignalUserChanged({
            isAudioActive: this.state.localUser.isAudioActive(),
            isVideoActive: this.state.localUser.isVideoActive(),
            nickname: this.state.localUser.getNickname(),
            isScreenShareActive: this.state.localUser.isScreenShareActive(),
          })
        }
        this.updateLayout()
      }
    )
  }

  async handleConfirmLeave() {
    this.leaveSession() // 세션 떠나기
    this.setState({ showModal: false }) // 모달 숨기기
    // 페이지 이동 (필요한 경우)
    this.props.navigate('/consultationlist')
  }

  handleCancelLeave() {
    this.setState({ showModal: false }) // 모달 숨기기
  }

  leaveSession() {
    const mySession = this.state.session

    if (mySession) {
      mySession.disconnect()
    }

    if (this.state.localUser) {
      this.removeParticipant(this.state.localUser.getConnectionId()) // 참여자 리스트에서 로컬 사용자 제거
    }

    this.OV = null
    this.setState({
      session: undefined,
      subscribers: [],
      participants: [], // 세션 떠날 때 참여자 리스트 초기화
      mySessionId: 'SessionA',
      myUserName: 'OpenVidu_User' + Math.floor(Math.random() * 100),
      localUser: undefined,
    })
    if (this.props.leaveSession) {
      this.props.leaveSession()
    }
    // 페이지 이동 처리 추가
    this.props.navigate('/consultationlist')
  }

  addParticipant(user) {
    this.setState((prevState) => ({
      participants: [...prevState.participants, user],
    }))
  }

  removeParticipant(connectionId) {
    this.setState((prevState) => ({
      participants: prevState.participants.filter(
        (user) => user.getConnectionId() !== connectionId
      ),
    }))
  }

  camStatusChanged() {
    localUser.setVideoActive(!localUser.isVideoActive())
    localUser.getStreamManager().publishVideo(localUser.isVideoActive())
    this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() })
    this.setState({ localUser: localUser })
  }

  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive())
    localUser.getStreamManager().publishAudio(localUser.isAudioActive())
    this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() })
    this.setState({ localUser: localUser })

    // STT를 통해 음성 인식 시작
    if (localUser.isAudioActive()) {
      this.startStt()
    }
  }

  nicknameChanged(nickname) {
    let localUser = this.state.localUser
    localUser.setNickname(nickname)
    this.setState({ localUser: localUser })
    this.sendSignalUserChanged({
      nickname: this.state.localUser.getNickname(),
    })
  }

  deleteSubscriber(stream) {
    const remoteUsers = this.state.subscribers
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0]
    let index = remoteUsers.indexOf(userStream, 0)
    if (index > -1) {
      remoteUsers.splice(index, 1)
      this.setState({
        subscribers: remoteUsers,
      })
      this.removeParticipant(userStream.getConnectionId()) // 참여자 리스트에서 제거
    }
  }

  subscribeToStreamCreated() {
    this.state.session.on('streamCreated', (event) => {
      const subscriber = this.state.session.subscribe(event.stream, undefined)
      subscriber.on('streamPlaying', (e) => {
        this.checkSomeoneShareScreen()
        subscriber.videos[0].video.parentElement.classList.remove(
          'custom-class'
        )
      })
      const newUser = new UserModel()
      newUser.setStreamManager(subscriber)
      newUser.setConnectionId(event.stream.connection.connectionId)
      newUser.setType('remote')
      const nickname = event.stream.connection.data.split('%')[0]
      newUser.setNickname(JSON.parse(nickname).clientData)
      this.setState(
        (prevState) => ({
          subscribers: [...prevState.subscribers, newUser],
        }),
        () => {
          this.addParticipant(newUser) // 참여자 리스트에 추가
          if (this.localUserAccessAllowed) {
            this.updateSubscribers()
          }
        }
      )
    })
  }

  subscribeToStreamDestroyed() {
    this.state.session.on('streamDestroyed', (event) => {
      this.deleteSubscriber(event.stream)
      setTimeout(() => {
        this.checkSomeoneShareScreen()
      }, 20)
      event.preventDefault()
      this.updateLayout()
      this.removeParticipant(event.stream.connection.connectionId) // 참여자 리스트에서 제거
    })
  }

  subscribeToUserChanged() {
    this.state.session.on('signal:userChanged', (event) => {
      let remoteUsers = this.state.subscribers
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data)
          console.log('EVENTO REMOTE: ', event.data)
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive)
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive)
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname)
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive())
          }
        }
      })
      this.setState(
        {
          subscribers: remoteUsers,
        },
        () => this.checkSomeoneShareScreen()
      )
    })
  }

  updateLayout() {
    setTimeout(() => {
      this.layout.updateLayout()
    }, 20)
  }

  sendSignalUserChanged(data) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    }
    this.state.session.signal(signalOptions)
  }

  startStt() {
    // STT 초기화 및 시작
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'ko-KR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    console.log('stt 시작')

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('STT result:', transcript)
      // STT 결과를 store에 저장
      useChatStore.getState().saveSttText(transcript)
    }

    recognition.onerror = (event) => {
      console.error('STT error:', event.error)
    }

    recognition.start()
  }

  toggleFullscreen() {
    const document = window.document
    const fs = document.getElementById('container')
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen()
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen()
      } else if (fs.mozFullScreen) {
        fs.mozFullScreen()
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices()
      var videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        )

        if (newVideoDevice.length > 0) {
          var newPublisher = this.OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            mirror: true,
          })

          await this.state.session.unpublish(
            this.state.localUser.getStreamManager()
          )
          await this.state.session.publish(newPublisher)
          this.state.localUser.setStreamManager(newPublisher)
          this.setState({
            currentVideoDevice: newVideoDevice,
            localUser: localUser,
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  screenShare() {
    const videoSource =
      navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen'
    const publisher = this.OV.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
          this.setState({ showExtensionDialog: true })
        } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
          alert('Your browser does not support screen sharing')
        } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
          alert('You need to enable screen sharing extension')
        } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
          alert('You need to choose a window or application to share')
        }
      }
    )

    publisher.once('accessAllowed', () => {
      this.state.session.unpublish(localUser.getStreamManager())
      localUser.setStreamManager(publisher)
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true)
        this.setState({ localUser: localUser }, () => {
          this.sendSignalUserChanged({
            isScreenShareActive: localUser.isScreenShareActive(),
          })
        })
      })
    })
    publisher.on('streamPlaying', () => {
      this.updateLayout()
      publisher.videos[0].video.parentElement.classList.remove('custom-class')
    })
  }

  closeDialogExtension() {
    this.setState({ showExtensionDialog: false })
  }

  stopScreenShare() {
    this.state.session.unpublish(localUser.getStreamManager())
    this.connectWebCam()
  }

  checkSomeoneShareScreen() {
    let isScreenShared =
      this.state.subscribers.some((user) => user.isScreenShareActive()) ||
      localUser.isScreenShareActive()
    const openviduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: 'OV_big',
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    }
    this.layout.setLayoutOptions(openviduLayoutOptions)
    this.updateLayout()
  }

  toggleChat(property) {
    let display = property

    if (display === undefined) {
      display = this.state.chatDisplay === 'none' ? 'block' : 'none'
    }
    if (display === 'block') {
      this.setState({ chatDisplay: display, messageReceived: false })
    } else {
      console.log('chat', display)
      this.setState({ chatDisplay: display })
    }
    this.updateLayout()
  }

  checkNotification(event) {
    this.setState({
      messageReceived: this.state.chatDisplay === 'none',
    })
  }

  checkSize() {
    if (
      document.getElementById('layout').offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
      this.toggleChat('none')
      this.hasBeenUpdated = true
    }
    if (
      document.getElementById('layout').offsetWidth > 700 &&
      this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = false
    }
  }

  handleParticipantAction(participant) {
    console.log('Action button clicked for:', participant.nickname)
    // 여기서 participant에 대한 작업을 수행합니다. 예: 참가자 제거, 권한 변경 등
  }

  render() {
    const mySessionId = this.state.mySessionId
    const localUser = this.state.localUser
    const chatDisplay = { display: this.state.chatDisplay }

    return (
      <>
        {this.state.showModal && (
          <ConfirmLeaveModal
            onConfirm={() => this.handleConfirmLeave(this.state.consultationId)}
            onCancel={this.handleCancelLeave}
          />
        )}
        <div className="container" id="container">
          <ToolbarComponent
            sessionId={mySessionId}
            user={localUser}
            showNotification={this.state.messageReceived}
            camStatusChanged={this.camStatusChanged}
            micStatusChanged={this.micStatusChanged}
            screenShare={this.screenShare}
            stopScreenShare={this.stopScreenShare}
            toggleFullscreen={this.toggleFullscreen}
            switchCamera={this.switchCamera}
            leaveSession={() => this.setState({ showModal: true })}
            toggleChat={this.toggleChat}
          />

          <DialogExtensionComponent
            showDialog={this.state.showExtensionDialog}
            cancelClicked={this.closeDialogExtension}
          />

          <div id="layout" className="bounds">
            {localUser !== undefined &&
              localUser.getStreamManager() !== undefined && (
                <div
                  className="OT_root OT_publisher custom-class"
                  id="localUser"
                >
                  <StreamComponent
                    user={localUser}
                    handleNickname={this.nicknameChanged}
                  />
                </div>
              )}
            {this.state.subscribers.map((sub, i) => (
              <div
                key={i}
                className="OT_root OT_publisher custom-class"
                id="remoteUsers"
              >
                <StreamComponent
                  user={sub}
                  streamId={sub.streamManager.stream.streamId}
                />
              </div>
            ))}
            {localUser !== undefined &&
              localUser.getStreamManager() !== undefined && (
                <div
                  className="OT_root OT_publisher custom-class"
                  style={chatDisplay}
                >
                  <ChatComponent
                    user={localUser}
                    chatDisplay={this.state.chatDisplay}
                    close={this.toggleChat}
                    messageReceived={this.checkNotification}
                  />
                </div>
              )}

            {/* Participants List */}
            <div className="participants-list">
              <h3>Participants:</h3>
              <ul>
                {this.state.participants.map((participant, index) => (
                  <li key={index}>
                    {participant.nickname}
                    <button
                      onClick={() => this.handleParticipantAction(participant)}
                    >
                      Action
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* GPT 버튼 주석 처리됨 */}
          {/*
          <button
            onClick={() =>
              useChatStore.getState().sendMessage(
                this.state.myUserName,
                useChatStore.getState().sttText,
                'general' // 카테고리 설정
              )
            }
          >
            Send to GPT
          </button>
          */}
        </div>
      </>
    )
  }
}

export default withNavigate(VideoRoomComponent)
