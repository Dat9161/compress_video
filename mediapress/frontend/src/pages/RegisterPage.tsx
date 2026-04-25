import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { LogoCube } from '../components/LogoCube';

export function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuthStore();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

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
          <p className="text-gray-400 text-sm mt-1">Tạo tài khoản miễn phí</p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-xl mb-4 text-center">{error}</div>
        )}

        {/* Google */}
        <a href="http://localhost:3001/api/auth/google"
          className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Đăng ký với Google
        </a>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">hoặc dùng email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Họ tên" value={form.name} onChange={set('name')}
            className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-800 px-4 py-3 rounded-xl outline-none transition-all"
            required
          />
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')}
            className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-800 px-4 py-3 rounded-xl outline-none transition-all"
            required
          />
          <input type="password" placeholder="Mật khẩu (tối thiểu 8 ký tự)" value={form.password} onChange={set('password')}
            className="w-full bg-gray-50 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-800 px-4 py-3 rounded-xl outline-none transition-all"
            required
          />
          <button type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
            Tạo tài khoản
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <span className="underline cursor-pointer">Điều khoản</span> và{' '}
          <span className="underline cursor-pointer">Chính sách bảo mật</span>
        </p>

        <p className="text-sm text-gray-500 text-center mt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-gray-900 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
