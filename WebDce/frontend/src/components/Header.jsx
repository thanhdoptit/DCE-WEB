import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
  const [user, setUser] = useState(null);
  const [shift, setShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState('');
  const navigate = useNavigate();

  const shifts = ['T1', 'T2', 'T3', 'H1', 'H2', 'V1', 'V2'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsed = JSON.parse(storedUser);
    setUser(parsed);
    fetchCurrentShift();
  }, []);

  const fetchCurrentShift = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/shifts/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        setShift(null);
        return;
      }

      const data = await res.json();
      setShift(data.shift);
    } catch (err) {
      console.error('Không tìm thấy ca trực hiện tại:', err.message);
    }
  };

  const handleShiftSelect = async (e) => {
    const code = e.target.value;
    if (!code) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/shifts/select`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shiftCode: code })
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }

      setShift(result.shift);
      setSelectedShift(code);
    } catch (err) {
      console.error('❌ Shift select error:', err);
      alert('Có lỗi khi chọn ca');
    }
  };

  const handleEndShift = async () => {
    if (!shift) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/shifts/close/${shift.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert('Đã kết thúc ca làm việc.');
      setShift(null); // reset về trạng thái chưa có ca
    } catch (err) {
      console.error('❌ Lỗi khi kết thúc ca:', err);
      alert('Có lỗi khi kết thúc ca');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">Hệ thống quản lý ca trực</h1>
      <div className="flex items-center gap-4">
        {user.role === 'Datacenter' && (
          <>
            <span>
              Ca hiện tại: <strong>{shift ? `${shift.code} (${shift.status})` : 'Chưa có ca'}</strong>
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
            {shift && shift.status !== 'done' && (
              <button
                onClick={handleEndShift}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Kết thúc ca
              </button>
            )}
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
