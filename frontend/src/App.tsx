import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { useAuth } from './auth/useAuth';
import { setTokenGetter } from './api/client';

export default function App() {
  const { account, getIdToken } = useAuth();
  const isAuthenticated = account !== null;

  useEffect(() => {
    setTokenGetter(getIdToken);
  }, [getIdToken]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
