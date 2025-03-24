import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Header from './components/Header';

// Dummy pages
const AdminPage = () => <div><Header /><div className="p-10">🎩 Trang Admin</div></div>;
const DCPage = () => <div><Header /><div className="p-10">🖥️ Trang Datacenter</div></div>;
const ManagerPage = () => <div><Header /><div className="p-10">📊 Trang Manager</div></div>;
const BEPage = () => <div><Header /><div className="p-10">⚙️ Trang Backend Engineer</div></div>;
const UserPage = () => <div><Header /><div className="p-10">👤 Trang User</div></div>;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<ProtectedRoute><Header /><UserProfile /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/dc" element={<ProtectedRoute><DCPage /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute><ManagerPage /></ProtectedRoute>} />
        <Route path="/be" element={<ProtectedRoute><BEPage /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
