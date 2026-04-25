import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CompressVideoPage } from './pages/CompressVideoPage';
import { EditImagePage } from './pages/EditImagePage';
import { HistoryPage } from './pages/HistoryPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';

export default function App() {
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => { loadUser(); }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/compress-video" element={<ProtectedRoute><CompressVideoPage /></ProtectedRoute>} />
        <Route path="/edit-image" element={<ProtectedRoute><EditImagePage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
