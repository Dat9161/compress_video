import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Đăng ký</h1>
          <p className="text-gray-500 text-sm mt-1">Tạo tài khoản MediaPress miễn phí</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Họ tên" value={form.name} onChange={set('name')}
            className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            required
          />
          <input
            type="email" placeholder="Email" value={form.email} onChange={set('email')}
            className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            required
          />
          <input
            type="password" placeholder="Mật khẩu (tối thiểu 8 ký tự, có chữ hoa và số)"
            value={form.password} onChange={set('password')}
            className="w-full bg-gray-50 text-gray-800 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            required
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors text-base"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-4 text-center">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
