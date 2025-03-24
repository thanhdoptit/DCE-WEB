import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
const POLLING_INTERVAL = 30000; // 30 seconds

export default function Header({ user }) {
  const [shift, setShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState('');
  const [availableShifts, setAvailableShifts] = useState([]);
  const navigate = useNavigate();

  const fetchAvailableShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Lấy tất cả ca trong ngày
      const res = await fetch(`${API_URL}/api/shifts/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const allShifts = await res.json();
      
      // Lọc ra các ca đã tồn tại và chưa kết thúc
      const existingShiftCodes = allShifts
        .filter(s => s.status !== 'done')
        .map(s => s.code);

      // Thêm các ca cố định nếu chưa tồn tại hoặc chưa kết thúc
      const fixedShifts = ['T1', 'T2', 'T3', 'H1', 'H2', 'V1', 'V2'];
      const availableCodes = fixedShifts.filter(code => !allShifts.some(s => s.code === code && s.status === 'done'));
      
      // Tạo danh sách ca có thể chọn
      const availableShifts = availableCodes.map(code => ({
        code,
        exists: existingShiftCodes.includes(code)
      }));
      
      setAvailableShifts(availableShifts);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách ca:', err);
    }
  };

  const fetchCurrentShift = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_URL}/api/shifts/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      if (!res.ok) {
        console.error('Lỗi khi lấy ca trực:', res.status);
        setShift(null);
        return;
      }

      const data = await res.json();
      setShift(data.shift); // Có thể null, đây là trường hợp bình thường
    } catch (err) {
      console.error('Lỗi khi lấy ca trực:', err.message);
      setShift(null);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Gọi lần đầu
    fetchCurrentShift();
    fetchAvailableShifts();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchCurrentShift();
      fetchAvailableShifts();
    }, POLLING_INTERVAL);

    // Cleanup khi component unmount
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleShiftSelect = async (e) => {
    const code = e.target.value;
    if (!code) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/shifts/select`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shiftCode: code })
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }

      setShift(result.shift);
      setSelectedShift(code);
      // Refresh danh sách ca có thể chọn
      fetchAvailableShifts();
    } catch (err) {
      console.error('❌ Shift select error:', err);
      alert('Có lỗi khi chọn ca');
    }
  };

  const handleEndShift = async () => {
    if (!shift) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/shifts/close/${shift.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert('Đã kết thúc ca làm việc.');
      setShift(null); // reset về trạng thái chưa có ca
      // Refresh danh sách ca có thể chọn
      fetchAvailableShifts();
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
              disabled={availableShifts.length === 0}
            >
              <option value="">Chọn ca</option>
              {availableShifts.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code}{s.exists ? ' (Đang diễn ra)' : ''}
                </option>
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
