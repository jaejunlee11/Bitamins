import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from 'stories/pages/main/MainPage'
import LoginPage from 'stories/pages/account/LoginPage'
import SignUpPage from 'stories/pages/account/SignUpPage'
import SurveyPage from 'stories/pages/account/SurveyPage'
import MissionPage from 'stories/pages/mission/MissionPage'
import ConsultationListPage from 'stories/pages/counsultation/ConsultationListPage'
import ConsultationPage from 'stories/pages/counsultation/ConsultationPage'
import VideoRoomComponent from 'stories/organisms/consultation/components/VideoRoomComponent'
// import CounsultPage from 'stories/pages/counsultation/CounsultPage'
// import Counsult from 'stories/pages/counsultation/Counsult.js'
import ConsultationSharingPage from 'stories/pages/counsultation/ConsultationSharingPage'
import HealthUpListPage from 'stories/pages/healthup/HealthUpListPage'
import HealthUpPage from 'stories/pages/healthup/HealthUpPage'
import MessageListMainPage from 'stories/pages/message/MessageListMainPage'
import ParticipantListPage from 'stories/pages/message/ParticipantListPage'
import ReplyPage from 'stories/pages/message/ReplyPage'
import AdiminPage from 'stories/pages/admin/AdiminPage'
import LandingPage from 'stories/pages/main/LandingPage'
import ExLogin from 'stories/pages/account/ExLogin'
import MyPage from 'stories/pages/account/MyPage'
import ComponentPage from 'stories/pages/ComponentPage'
import AuthPage from '@/stories/pages/account/AuthPage'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/component" element={<ComponentPage />} />
      <Route path="" element={<LandingPage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/loginex" element={<ExLogin />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/consultationlist" element={<ConsultationListPage />} />
      <Route path="/consult" element={<VideoRoomComponent />} />
      {/* <Route path="/consultation" element={<ConsultationPage />} /> */}
      <Route path="/auth" element={<AuthPage />} />
      {/* <Route path="/counsult" element={<Counsult />} /> */}
      <Route
        path="/counsultationsharing"
        element={<ConsultationSharingPage />}
      />
      <Route path="/healthuplist" element={<HealthUpListPage />} />
      <Route path="/healthup" element={<HealthUpPage />} />
      <Route path="/messagelist" element={<MessageListMainPage />} />
      <Route path="/participantlist" element={<ParticipantListPage />} />
      <Route path="/reply" element={<ReplyPage />} />
      <Route path="/admin" element={<AdiminPage />} />
        <Route path="/mission" element={<MissionPage />} />
    </Routes>
  )
}

export default AppRouter
