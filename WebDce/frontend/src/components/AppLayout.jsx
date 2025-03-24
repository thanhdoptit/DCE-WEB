import { Outlet, Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useEffect, useState } from 'react';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error('Invalid user data:', err);
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  const menus = {
    Datacenter: [
      { label: 'Ca làm việc', path: '/dc/shifts' },
      { label: 'Công việc phát sinh', path: '/dc/task' },
      { label: 'Bàn giao ca', path: '/dc/handover' }
    ],
    Manager: [
      { label: 'Tổng quan', path: '/manager/overview' },
      { label: 'Thống kê', path: '/manager/stats' }
    ]
  };

  const currentMenu = menus[user.role] || [];

  return (
    <>
      <Header user={user} />
      {currentMenu.length > 0 && (
        <nav className="flex bg-gray-100 border-b border-gray-300 px-6 py-2">
          {currentMenu.map((m) => (
            <Link
              key={m.path}
              to={m.path}
              className="mr-6 text-blue-600 hover:underline font-medium"
            >
              {m.label}
            </Link>
          ))}
        </nav>
      )}
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}
