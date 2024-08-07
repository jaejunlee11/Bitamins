import { OpenVidu, Publisher, Session, StreamManager } from 'openvidu-browser'
import axios from 'axios'
import React, { Component } from 'react'
import './App.css'
import UserVideoComponent from './UserVideoComponent'

const APPLICATION_SERVER_URL = 'https://i11b105.p.ssafy.io:4443'

interface State {
  mySessionId: string
  myUserName: string
  session?: Session
  mainStreamManager?: StreamManager
  publisher?: Publisher
  subscribers: StreamManager[]
  currentVideoDevice?: MediaDeviceInfo
}

class Counsult extends Component<{}, State> {
  private OV: OpenVidu | null = null

  constructor(props: {}) {
    super(props)

    this.state = {
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
    }

    this.joinSession = this.joinSession.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this)
    this.handleChangeUserName = this.handleChangeUserName.bind(this)
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this)
    this.onbeforeunload = this.onbeforeunload.bind(this)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onbeforeunload)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload)
  }

  onbeforeunload(event: BeforeUnloadEvent) {
    this.leaveSession()
  }

  handleChangeSessionId(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      mySessionId: e.target.value,
    })
  }

  handleChangeUserName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      myUserName: e.target.value,
    })
  }

  handleMainVideoStream(stream: StreamManager) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      })
    }
  }

  deleteSubscriber(streamManager: StreamManager) {
    const subscribers = this.state.subscribers
    const index = subscribers.indexOf(streamManager, 0)
    if (index > -1) {
      subscribers.splice(index, 1)
      this.setState({
        subscribers: subscribers,
      })
    }
  }

  joinSession() {
    this.OV = new OpenVidu()

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        const mySession = this.state.session!

        mySession.on('streamCreated', (event) => {
          const subscriber = mySession.subscribe(event.stream, undefined)
          const subscribers = this.state.subscribers
          subscribers.push(subscriber)

          this.setState({
            subscribers: subscribers,
          })
        })

        mySession.on('streamDestroyed', (event) => {
          this.deleteSubscriber(event.stream.streamManager)
        })

        mySession.on('exception', (exception) => {
          console.warn(exception)
        })

        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              const publisher = await this.OV!.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
              })

              mySession.publish(publisher)

              const devices = await this.OV!.getDevices()
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

              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              })
            })
            .catch((error) => {
              console.log(
                'There was an error connecting to the session:',
                error.code,
                error.message
              )
            })
        })
      }
    )
  }

  leaveSession() {
    const mySession = this.state.session

    if (mySession) {
      mySession.disconnect()
    }

    this.OV = null
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    })
  }

  async switchCamera() {
    try {
      const devices = await this.OV!.getDevices()
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) =>
            device.deviceId !== this.state.currentVideoDevice!.deviceId
        )

        if (newVideoDevice.length > 0) {
          const newPublisher = this.OV!.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          })

          await this.state.session!.unpublish(this.state.mainStreamManager!)
          await this.state.session!.publish(newPublisher)

          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const mySessionId = this.state.mySessionId
    const myUserName = this.state.myUserName

    return (
      <div className="container">
        {this.state.session === undefined ? (
          <div id="join">
            <div id="img-div">
              <img
                src="resources/images/openvidu_grey_bg_transp_cropped.png"
                alt="OpenVidu logo"
              />
            </div>
            <div id="join-dialog" className="jumbotron vertical-center">
              <h1> 화상 세션에 참가하기 </h1>
              <form
                className="form-group"
                onSubmit={(e) => {
                  e.preventDefault()
                  this.joinSession()
                }}
              >
                <p>
                  <label>참가자: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={this.handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> 세션: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={this.handleChangeSessionId}
                    required
                  />
                </p>
                <p className="text-center">
                  <input
                    className="btn btn-lg btn-success"
                    name="commit"
                    type="submit"
                    value="JOIN"
                  />
                </p>
              </form>
            </div>
          </div>
        ) : null}

        {this.state.session !== undefined ? (
          <div id="session">
            <div id="session-header">
              <h1 id="session-title">{mySessionId}</h1>
              <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={this.leaveSession}
                value="Leave session"
              />
              <input
                className="btn btn-large btn-success"
                type="button"
                id="buttonSwitchCamera"
                onClick={this.switchCamera}
                value="Switch Camera"
              />
            </div>

            {this.state.mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6">
                <UserVideoComponent
                  streamManager={this.state.mainStreamManager}
                />
              </div>
            ) : null}
            <div id="video-container" className="col-md-6">
              {this.state.publisher !== undefined ? (
                <div
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher!)
                  }
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={i}
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId)
    return await this.createToken(sessionId)
  }

  async createSession(sessionId: string) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + '/api/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.data // 세션 ID
  }

  async createToken(sessionId: string) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + '/api/sessions/' + sessionId + '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.data // 토큰
  }
}

export default Counsult
