import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { LogoCube } from './LogoCube';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const homeLink = user ? '/dashboard' : '/';

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to={homeLink} className="flex items-center gap-2.5">
          <LogoCube size={32} />
          <span className="font-black text-lg tracking-tight text-gray-900">MediaPress</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Trang chủ</Link>
              <Link to="/compress-video" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Nén Video</Link>
              <Link to="/edit-image" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Chỉnh ảnh</Link>
              <Link to="/history" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Lịch sử</Link>
              <div className="w-px h-5 bg-gray-200 mx-2" />
              <span className="text-sm text-gray-500 mr-1">{user.name}</span>
              <button onClick={handleLogout}
                className="text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 px-4 py-1.5 rounded-full transition-colors"
              >Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-1.5 rounded-full transition-colors">
                Đăng nhập
              </Link>
              <Link to="/register"
                className="text-sm font-semibold bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-1">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2.5 border-b border-gray-50">Trang chủ</Link>
              <Link to="/compress-video" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2.5 border-b border-gray-50">Nén Video</Link>
              <Link to="/edit-image" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2.5 border-b border-gray-50">Chỉnh ảnh</Link>
              <Link to="/history" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2.5 border-b border-gray-50">Lịch sử</Link>
              <div className="pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">{user.name}</span>
                <button onClick={handleLogout} className="text-sm font-medium border border-gray-300 px-4 py-1.5 rounded-full">Đăng xuất</button>
              </div>
            </>
          ) : (
            <div className="flex gap-3 pt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-medium border border-gray-300 py-2 rounded-full">Đăng nhập</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-semibold bg-gray-900 text-white py-2 rounded-full">Đăng ký</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
