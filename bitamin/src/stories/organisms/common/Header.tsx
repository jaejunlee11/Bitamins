import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'
import { useCookies } from 'react-cookie'
import useUserStore from '@/store/useUserStore'

const Header: FunctionComponent<{ username?: string }> = ({ username }) => {
  const navigate = useNavigate()
  const { accessToken, refreshToken, clearAuth, role } = useAuthStore()
  const [, , removeCookie] = useCookies(['refreshToken'])
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const { user, fetchUser } = useUserStore()

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [user, fetchUser])

  const onBItAMinTextClick = useCallback(() => {
    navigate('/home')
  }, [navigate])

  const onConsultationClick = useCallback(() => {
    navigate('/consultationlist')
  }, [navigate])

  const onLoginTextClick = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const onMissionClick = useCallback(() => {
    navigate('/mission')
  }, [navigate])

  const onHealthUPClick = useCallback(() => {
    navigate('/healthuplist')
  }, [navigate])

  const onAdminClick = useCallback(() => {
    navigate('/admin')
  }, [navigate])

  const onMessageClick = useCallback(() => {
    navigate('/messagelist')
  }, [navigate])

  const onSignupTextClick = useCallback(() => {
    navigate('/signup')
  }, [navigate])

  const onLogoutClick = useCallback(() => {
    clearAuth()
    removeCookie('refreshToken', { path: '/' })
    alert('Logged out successfully!')
    navigate('/home')
  }, [navigate, clearAuth, removeCookie])

  const toggleDropdown = useCallback(() => {
    setDropdownVisible((prev) => !prev)
  }, [])

  return (
    <header className="flex justify-between p-4 bg-gray-800 text-white">
      <h1>My App</h1>
      <Button
        label="Sign In"
        type="DEFAULT"
        onClick={() => alert('Sign In clicked')}
      />
    </header>
  )
}

export default Header
