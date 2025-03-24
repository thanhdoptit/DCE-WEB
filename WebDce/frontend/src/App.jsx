import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AppLayout from './components/AppLayout';
import ShiftList from './pages/ShiftList';
import { useEffect } from 'react';
import TaskPage from './pages/TaskPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    // Xóa dữ liệu không hợp lệ
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  try {
    // Kiểm tra user data có hợp lệ không
    JSON.parse(user);
    return children;
  } catch (err) {
    console.error('Invalid user data:', err);
    localStorage.clear();
    return <Navigate to="/login" />;
  }
};

// Dummy pages

const HandoverPage = () => <div>🔄 Bàn giao ca</div>;

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Protected layout dùng chung */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Tất cả các route bên trong đều sẽ render trong AppLayout */}
          <Route path="me" element={<UserProfile />} />
          <Route path="dc/shifts" element={<ShiftList />} />
          <Route path="dc/handover" element={<HandoverPage />} />
          <Route path="dc/task" element={<TaskPage />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
