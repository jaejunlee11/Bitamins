import React from 'react'
import OpenViduVideoComponent from './OvVideo'
import { StreamManager } from 'openvidu-browser'

interface UserVideoComponentProps {
  streamManager: StreamManager
}

const UserVideoComponent: React.FC<UserVideoComponentProps> = ({
  streamManager,
}) => {
  const getNicknameTag = (): string => {
    return JSON.parse(streamManager.stream.connection.data).clientData
  }

  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default UserVideoComponent
