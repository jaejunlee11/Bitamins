import React from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import AppRouter from 'router/AppRouter'
import Footer from 'stories/organisms/common/Footer'
import Header from './stories/organisms/common/Header'

const AppContent: React.FC = () => {
  const location = useLocation()
  const excludeHeaderPaths = ['/']
  const excludeFooterPaths = ['/', '/modal', '/consult', '/healthup']

  return (
    <div className="flex flex-col min-h-screen">
      {!excludeHeaderPaths.includes(location.pathname) && <Header />}
      <div className="flex-grow mt-[5%]">
        <AppRouter />
      </div>
      {!excludeFooterPaths.includes(location.pathname) && <Footer />}
    </div>
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
