import React, { Component, RefObject } from 'react'
import { StreamManager } from 'openvidu-browser'

interface Props {
  streamManager: StreamManager
}

export default class OpenViduVideoComponent extends Component<Props> {
  private videoRef: RefObject<HTMLVideoElement>

  constructor(props: Props) {
    super(props)
    this.videoRef = React.createRef()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.streamManager !== this.props.streamManager &&
      this.videoRef.current
    ) {
      this.props.streamManager.addVideoElement(this.videoRef.current)
    }
  }

  componentDidMount() {
    if (this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current)
    }
  }

  render() {
    return <video autoPlay={true} ref={this.videoRef} />
  }
}
