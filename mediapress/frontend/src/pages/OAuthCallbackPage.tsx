import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth.store';

export function OAuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access');
    const refreshToken = params.get('refresh');

    if (!accessToken || !refreshToken) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // Lưu token
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Lấy thông tin user rồi mới navigate
    api.get('/auth/me').then(({ data }) => {
      useAuthStore.setState({ user: data, isLoading: false });
      navigate('/dashboard', { replace: true });
    }).catch(() => {
      navigate('/login?error=oauth_failed', { replace: true });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Đang đăng nhập...</p>
      </div>
    </div>
  );
}
