import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CompressVideoPage } from './pages/CompressVideoPage';
import { EditImagePage } from './pages/EditImagePage';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => { loadUser(); }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Đang tải...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/compress-video" element={<ProtectedRoute><CompressVideoPage /></ProtectedRoute>} />
        <Route path="/edit-image" element={<ProtectedRoute><EditImagePage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
