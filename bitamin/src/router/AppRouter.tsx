import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from 'stories/pages/main/MainPage'
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
import AdiminDetail from '@/stories/pages/admin/AdminDetail'
import LandingPage from 'stories/pages/main/LandingPage'
import ExLogin from 'stories/pages/account/ExLogin'
import MyPage from 'stories/pages/account/MyPage'
import ComponentPage from 'stories/pages/ComponentPage'
import AuthPage from '@/stories/pages/account/AuthPage'
import PrivateRoute from './PrivateRouter'
import PasswordChangePage from '@/stories/pages/account/PasswordChangePage'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* 인증 여부 없이도 접속 가능한 페이지 */}
      <Route path="" element={<LandingPage />} />
      <Route path="/component" element={<ComponentPage />} />

      {/* 인증 반드시 필요한 페이지 */}
      <Route element={<PrivateRoute authentication={true} />}>
        <Route path="/home" element={<MainPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/change-password" element={<PasswordChangePage />} />
        <Route path="/counsultationlist" element={<ConsultationListPage />} />
        <Route path="/counsultation" element={<ConsultationPage />} />
        <Route
          path="/counsultationsharing"
          element={<ConsultationSharingPage />}
        />
        <Route path="/healthuplist" element={<HealthUpListPage />} />
        <Route path="/healthup" element={<HealthUpPage />} />
        <Route path="/messagelist" element={<MessageListMainPage />} />
        <Route path="/participantlist" element={<ParticipantListPage />} />
        <Route path="/reply" element={<ReplyPage />} />

        {/* 관리자페이지 */}
        <Route
          path="/admin"
          element={
            <PrivateRoute authentication={true} requiredRole="ROLE_ADMIN">
              <AdiminPage />
            </PrivateRoute>
          }
        />
        <Route path="/admin/:id" element={<AdiminDetail />} />
      </Route>

      {/* 인증 하지 않아야만 가능한 페이지 */}
      <Route element={<PrivateRoute authentication={false} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginex" element={<ExLogin />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      {/* <Route path="/auth" element={<AuthPage />} />  */}
      {/* <Route path="/counsult" element={<Counsult />} /> */}
    </Routes>
  )
}

export default AppRouter
