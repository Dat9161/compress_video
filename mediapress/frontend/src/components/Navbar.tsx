import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">MediaPress</Link>

        {user && (
          <>
            {/* Desktop menu */}
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Trang chủ</Link>
              <Link to="/history" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Lịch sử</Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-600">{user.name}</span>
              <button onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Đăng xuất
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </>
        )}
      </div>

      {/* Mobile dropdown */}
      {user && menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 py-2 hover:text-blue-600"
          >Trang chủ</Link>
          <Link to="/history" onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-700 py-2 hover:text-blue-600"
          >Lịch sử</Link>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">{user.name}</span>
            <button onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg"
            >Đăng xuất</button>
          </div>
        </div>
      )}
    </nav>
  );
}
