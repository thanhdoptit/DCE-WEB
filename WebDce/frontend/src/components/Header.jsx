import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
const shifts = ['T1', 'T2', 'T3', 'H1', 'H2', 'V1', 'V2'];

export default function Header() {
  const [user, setUser] = useState(null);
  const [selectedShift, setSelectedShift] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchShift(parsedUser.id);
  }, []);

  const fetchShift = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/users/${userId}/shift`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedShift(data.selectedShift);
      }
    } catch (err) {
      console.error('Lỗi lấy ca làm việc:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleShiftSelect = async (e) => {
    const shiftCode = e.target.value;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/users/selected-shift`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shiftCode })
      });

      const result = await res.json();

      if (res.ok) {
        setSelectedShift(shiftCode);
        alert('✅ Đã cập nhật ca trực: ' + shiftCode);
      } else {
        console.error('❌ Shift select error:', result.message);
        alert(result.message || 'Không thể cập nhật ca trực');
      }
    } catch (err) {
      console.error('🔥 Lỗi khi chọn ca:', err);
      alert('Có lỗi xảy ra khi chọn ca');
    }
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">Quản lý ca trực</h1>

      <div className="flex items-center gap-4">
        {user.role === 'Datacenter' && (
          <>
            <span>
              Ca hiện tại: <strong>{selectedShift || 'Chưa chọn'}</strong>
            </span>
            <select
              value={selectedShift}
              onChange={handleShiftSelect}
              className="text-black px-2 py-1 rounded"
            >
              <option value="">Chọn ca</option>
              {shifts.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}
        <span>👤 {user.fullname} ({user.role})</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
