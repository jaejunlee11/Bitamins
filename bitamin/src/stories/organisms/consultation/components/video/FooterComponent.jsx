import React from 'react'
import Mic from '@material-ui/icons/Mic'
import MicOff from '@material-ui/icons/MicOff'
import Videocam from '@material-ui/icons/Videocam'
import VideocamOff from '@material-ui/icons/VideocamOff'
import ScreenShare from '@material-ui/icons/ScreenShare'
import StopScreenShare from '@material-ui/icons/StopScreenShare'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'

const FooterComponent = ({
  isAudioActive,
  isVideoActive,
  isScreenSharing,
  onMicToggle,
  onCamToggle,
  onScreenShareToggle,
  onLeave,
}) => {
  return (
    <div className="flex justify-around items-center p-4 bg-gray-800 text-white">
      <button onClick={onMicToggle}>
        {isAudioActive ? <Mic /> : <MicOff />}
      </button>
      <button onClick={onCamToggle}>
        {isVideoActive ? <Videocam /> : <VideocamOff />}
      </button>
      <button onClick={onScreenShareToggle}>
        {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
      </button>
      <button onClick={onLeave}>
        <PowerSettingsNew />
      </button>
    </div>
  )
}

export default FooterComponent
