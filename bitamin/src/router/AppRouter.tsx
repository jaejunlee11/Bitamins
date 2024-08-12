// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from 'stories/pages/main/MainPage'
import MissionPage from 'stories/pages/mission/MissionPage'
import Weather from 'stories/pages/mission/Weather'
import LoginPage from 'stories/pages/account/LoginPage'
import SignUpPage from 'stories/pages/account/SignUpPage'
import SurveyPage from 'stories/pages/account/SurveyPage'
import ConsultationListPage from 'stories/pages/counsultation/ConsultationListPage'
import ConsultationPage from 'stories/pages/counsultation/ConsultationPage'
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
import MissionForm from '@/stories/pages/mission/MissionForm.tsx'
import CompleteMission from '@/stories/pages/mission/CompleteMission.tsx'
import CalendarCompleteMission from '@/stories/pages/mission/CalendarCompleteMission.tsx'
import MyPlant from '@/stories/pages/mission/MyPlant.tsx'

const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


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
          <Route path="/counsultationlist" element={<ConsultationListPage />} />
          <Route path="/counsultation" element={<ConsultationPage />} />
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
          <Route path="/missionform" element={<MissionForm />} />
          <Route path="/complete" element={<CompleteMission />} />
          <Route path="/completecal" element={<CalendarCompleteMission />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/plant" element={<MyPlant />} />
      </Routes>
    )
}

export default AppRouter
