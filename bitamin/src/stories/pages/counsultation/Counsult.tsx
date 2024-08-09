import React, { useEffect, useState, useRef } from 'react'
import {
  OpenVidu,
  Session,
  Publisher,
  StreamManager,
  Device,
} from 'openvidu-browser'
import UserVideoComponent from './UserVideoComponent'
import useConsultationStore from 'store/useConsultationStore'
import Chat from './Chat'
import ParticipantsList from './ParticipantsList'
import { synthesizeText, SynthesizeOptions } from './textToSpeeach'

const Consult: React.FC = () => {
  const [text, setText] = useState<string>('')
  const [audioSrc, setAudioSrc] = useState<string>('')
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }
  const handleSynthesize = async () => {
    const options: SynthesizeOptions = { text }
    try {
      const audioContent = await synthesizeText(options)
      setAudioSrc(`data:audio/mp3;base64,${audioContent}`)
    } catch (error) {
      console.error('Error synthesizing text:', error)
    }
  }
  const [session, setSession] = useState<Session | undefined>(undefined)
  const [mainStreamManager, setMainStreamManager] = useState<
    StreamManager | undefined
  >(undefined)
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined)
  const [screenPublisher, setScreenPublisher] = useState<Publisher | undefined>(
    undefined
  )
  const [subscribers, setSubscribers] = useState<StreamManager[]>([])
  const currentVideoDevice = useRef<Device | undefined>(undefined)

  const [gptmessage, setGptMessage] = useState<string>('')
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGptMessage(event.target.value) // 입력된 값을 상태에 반영
  }
  const {
    joinData,
    joinResponseData,
    myUserName,
    setMyUserName,
    initializeOpenViduSession,
    sendChatGPTMessage,
    messages, // Access the messages from the store
  } = useConsultationStore((state) => ({
    joinData: state.joinData,
    joinResponseData: state.joinResponseData,
    myUserName: state.myUserName,
    setMyUserName: state.setMyUserName,
    initializeOpenViduSession: state.initializeOpenViduSession,
    sendChatGPTMessage: state.sendChatGPTMessage,
    messages: state.messages, // Retrieve messages from the store
  }))

  useEffect(() => {
    if (joinResponseData?.sessionId && joinResponseData?.token) {
      joinSession(joinResponseData.sessionId, joinResponseData.token)
    }
  }, [joinResponseData])

  useEffect(() => {
    // When messages change, the component will re-render automatically
  }, [messages])

  const joinSession = (sessionId: string, token: string) => {
    console.log('Joining session with sessionId:', sessionId)
    console.log('Using token:', token)

    const OV = new OpenVidu()
    const newSession = OV.initSession()
    setSession(newSession)

    newSession.on('streamCreated', (event) => {
      console.log('Stream created:', event.stream.streamId)
      const subscriber = newSession.subscribe(event.stream, undefined)
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber])
    })

    newSession.on('streamDestroyed', (event) => {
      console.log('Stream destroyed:', event.stream.streamId)
      deleteSubscriber(event.stream.streamManager)
    })

    newSession.on('exception', (exception) => {
      console.warn(exception)
    })

    newSession
      .connect(token, { clientData: myUserName })
      .then(async () => {
        console.log('Connected to the session')
        try {
          const newPublisher = await OV.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          })

          newSession.publish(newPublisher)
          setPublisher(newPublisher)
          setMainStreamManager(newPublisher)

          const devices = await OV.getDevices()
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          )
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId
          currentVideoDevice.current = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          )
        } catch (error) {
          console.error('Error initializing publisher: ', error)
          let errorMessage = '카메라와 마이크 접근 중 오류가 발생했습니다. '
          if (error.name === 'NotAllowedError') {
            errorMessage +=
              '브라우저 설정에서 카메라와 마이크 접근 권한을 허용해주세요.'
          } else if (error.name === 'NotFoundError') {
            errorMessage +=
              '카메라나 마이크를 찾을 수 없습니다. 장치가 제대로 연결되어 있는지 확인해주세요.'
          } else {
            errorMessage += error.message
          }
          alert(errorMessage)
        }
      })
      .catch((error) => {
        console.error(
          '세션에 연결하는 동안 오류가 발생했습니다:',
          error.code,
          error.message
        )
        alert('Failed to connect to the session: ' + error.message)
      })
  }

  const handleMainVideoStream = (streamManager: StreamManager) => {
    if (mainStreamManager !== streamManager) {
      setMainStreamManager(streamManager)
    }
  }

  const deleteSubscriber = (streamManager: StreamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== streamManager)
    )
  }

  const leaveSession = () => {
    if (session) {
      session.disconnect()
    }
    setSession(undefined)
    setSubscribers([])
    setMainStreamManager(undefined)
    setPublisher(undefined)
    setScreenPublisher(undefined)
  }

  const switchCamera = async () => {
    if (!session || !publisher || !currentVideoDevice.current) return

    try {
      const devices = await session.openvidu.getDevices()
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      if (videoDevices.length > 1) {
        const newVideoDevice = videoDevices.find(
          (device) => device.deviceId !== currentVideoDevice.current!.deviceId
        )

        if (newVideoDevice) {
          const newPublisher = session.initPublisher(undefined, {
            videoSource: newVideoDevice.deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          })

          await session.unpublish(publisher)
          await session.publish(newPublisher)

          setPublisher(newPublisher)
          setMainStreamManager(newPublisher)
          currentVideoDevice.current = newVideoDevice
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const startScreenShare = async () => {
    if (session) {
      try {
        console.log('Starting screen share')
        const newScreenPublisher = await session.openvidu.initPublisherAsync(
          undefined,
          {
            videoSource: 'screen',
            publishAudio: true,
            publishVideo: true,
            mirror: false,
          }
        )
        session.publish(newScreenPublisher)
        setScreenPublisher(newScreenPublisher)
        setMainStreamManager(newScreenPublisher)
      } catch (error) {
        console.error('Error starting screen share: ', error)
      }
    }
  }

  const stopScreenShare = () => {
    if (session && screenPublisher) {
      session.unpublish(screenPublisher)
      setScreenPublisher(undefined)
      if (publisher) {
        setMainStreamManager(publisher)
      }
    }
  }

  const join = () => {
    if (joinResponseData) {
      joinSession(joinResponseData.sessionId, joinResponseData.token)
    } else {
      console.error('joinResponseData is null')
    }
  }

  const chatgpt = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(1)
    event.preventDefault() // 폼 제출을 막음
    try {
      await sendChatGPTMessage(myUserName, gptmessage, '음악')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="container">
      <p>{session ? 'Connected' : 'Not connected'}</p>
      {session === undefined ? (
        <div id="join">
          <div id="img-div">
            <img
              src="resources/images/openvidu_grey_bg_transp_cropped.png"
              alt="OpenVidu logo"
            />
          </div>
          <div id="join-dialog" className="jumbotron vertical-center">
            <h1> Join a video session </h1>
            <form className="form-group" onSubmit={(e) => e.preventDefault()}>
              <p>
                <label>Participant: </label>
                <input
                  className="form-control"
                  type="text"
                  id="userName"
                  value={myUserName}
                  onChange={(e) => setMyUserName(e.target.value)}
                  required
                />
              </p>
              <p>
                <label>Session: </label>
                <input
                  className="form-control"
                  type="text"
                  id="sessionId"
                  value={joinData?.sessionId || ''}
                  readOnly
                />
              </p>
              <button type="button" onClick={join} className="btn btn-primary">
                JOIN
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{joinData?.sessionId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
            <input
              className="btn btn-large btn-success"
              type="button"
              id="buttonSwitchCamera"
              onClick={switchCamera}
              value="Switch Camera"
            />
            <input
              className="btn btn-large btn-primary"
              type="button"
              id="buttonStartScreenShare"
              onClick={startScreenShare}
              value="Start Screen Share"
            />
            {screenPublisher && (
              <input
                className="btn btn-large btn-warning"
                type="button"
                id="buttonStopScreenShare"
                onClick={stopScreenShare}
                value="Stop Screen Share"
              />
            )}
          </div>

          {mainStreamManager !== undefined && (
            <div id="main-video" className="col-md-6">
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          )}
          <div id="video-container" className="col-md-6">
            {publisher !== undefined && (
              <div
                className="stream-container col-md-6 col-xs-6"
                onClick={() => handleMainVideoStream(publisher)}
              >
                <UserVideoComponent streamManager={publisher} />
              </div>
            )}
            {subscribers.map((sub, i) => (
              <div
                key={i}
                className="stream-container col-md-6 col-xs-6"
                onClick={() => handleMainVideoStream(sub)}
              >
                <span>{sub.id}</span>
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
          <ParticipantsList />

          {/* Button to send message to ChatGPT */}

          <form>
            <p>
              <label>채팅 입력: </label>
            </p>
            <input
              type="text"
              value={gptmessage}
              onChange={handleInputChange}
            />
            <button onClick={chatgpt} className="btn btn-large btn-info">
              GPT Button
            </button>
          </form>

          <div>
            <p>여기서 stt 구현</p>
            <textarea
              value={text}
              onChange={handleTextChange}
              rows={10}
              cols={50}
            />
            <button type="button" onClick={handleSynthesize}>
              Synthesize
            </button>
            {audioSrc && <audio controls src={audioSrc} />}
          </div>
          <br />
          <br />
          <br />
          <br />
          {/* Display messages */}
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Consult
