import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { LogoCube } from '../components/LogoCube';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuthStore();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Cube on top */}
        <div className="flex justify-center mb-6">
          <LogoCube size={80} />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-black text-2xl text-gray-900">MediaPress</Link>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-xl mb-4 text-center">{error}</div>
        )}

        {!showEmail ? (
          <div className="space-y-3">
            <a href="http://localhost:3001/api/auth/google"
              className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Đăng nhập với Google
            </a>
            <button onClick={() => setShowEmail(true)}
              className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-5 rounded-xl border border-gray-300 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Đăng nhập bằng Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-800 px-4 py-3 rounded-xl outline-none transition-all"
              required autoFocus
            />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-800 px-4 py-3 rounded-xl outline-none transition-all"
              required
            />
            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
              Đăng nhập
            </button>
            <button type="button" onClick={() => setShowEmail(false)}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
            >← Quay lại</button>
          </form>
        )}

        <p className="text-xs text-gray-400 text-center mt-5">
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <span className="underline cursor-pointer">Điều khoản</span> và{' '}
          <span className="underline cursor-pointer">Chính sách bảo mật</span>
        </p>

        <p className="text-sm text-gray-500 text-center mt-5">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-gray-900 hover:underline">Đăng ký miễn phí</Link>
        </p>
      </div>
    </div>
  );
}
