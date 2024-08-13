import React from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import AppRouter from 'router/AppRouter'
import Footer from 'stories/organisms/common/Footer'
import Header from './stories/organisms/common/Header'

const AppContent: React.FC = () => {
  const location = useLocation()
  const excludeHeaderPaths = ['/']
  const excludeFooterPaths = ['/', '/modal', '/consult', '/healthup'] // Footer를 제외할 경로들

  const isLoggedIn = false // 로그인 상태를 확인하는 로직이 필요

  return (
    <>
      <Header />
      {/* {!excludeHeaderPaths.includes(location.pathname) &&
        (isLoggedIn ? <HeaderAfterLogin /> : <HeaderBeforeLogin />)} */}
      <AppRouter />
      {/* {!excludeFooterPaths.includes(location.pathname) && <Footer />} */}
    </>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
