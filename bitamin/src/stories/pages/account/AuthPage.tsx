import { useState } from 'react';
import axiosInstance, { setAccessToken } from 'api/axiosInstance';
import useAuthStore from 'store/useAuthStore';
import { useCookies } from 'react-cookie';
import { fetchMessages } from 'api/messageAPI';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setCookie] = useCookies(['refreshToken']);

  const {
    accessToken,
    refreshToken,
    setAccessToken: setAuthAccessToken,
    setRefreshToken: setAuthRefreshToken,
    clearAuth,
  } = useAuthStore();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken); // 로컬 스토리지에 accessToken 저장
      setAuthAccessToken(accessToken); // zustand 상태 관리에 accessToken 설정
      setAuthRefreshToken(refreshToken); // zustand 상태 관리에 refreshToken 설정
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict',
      });

      alert('Login successful!');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed';
      alert(`Login failed: ${errorMessage}`);
      console.error('Login error:', error);
    }
  };

  const handleFetchMessages = async () => {
    try {
      const messages = await fetchMessages();
      console.log('Messages:', messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <button onClick={() => setAuthAccessToken('newAccessToken')}>
          Set Access Token
        </button>
        <br />
        <button onClick={() => setAuthRefreshToken('newRefreshToken')}>
          Set Refresh Token
        </button>
        <br />
        <button onClick={clearAuth}>Clear Tokens</button>
        <br />
        <button onClick={handleFetchMessages}>Fetch Messages</button>
        <p>Current Access Token: {accessToken}</p>
        <p>Current Refresh Token: {refreshToken}</p>
      </div>
    </div>
  );
};

export default AuthPage;
