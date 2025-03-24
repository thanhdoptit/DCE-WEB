import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedShift, setSelectedShift] = useState('');
  const [shiftId, setShiftId] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.username) {
      setUser(storedUser);
      setSelectedShift(storedUser.selectedShift || '');
      setShiftId(storedUser.shiftId || '');  // Lấy shiftId từ localStorage
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleShiftSelect = async (e) => {
    const shift = e.target.value;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/selected-shift`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ shiftCode: shift })
      });
  
      if (!res.ok) throw await res.json();
  
      const updated = { ...user, selectedShift: shift };
      setUser(updated); 
      setSelectedShift(shift);
      localStorage.setItem('user', JSON.stringify(updated)); // Lưu lại vào localStorage
    } catch (err) {
      console.error(err);
      alert(err.message || 'Không thể chọn ca');
    }
  };
  if (!user) return null;

  const hasSession = Boolean(localStorage.getItem('currentWorkSession'));
  const canChooseShift = user.role === 'Datacenter' && !hasSession; // Chỉ Datacenter mới chọn ca

  return (
    <header className="flex justify-between items-center bg-blue-600 text-white p-4 shadow">
      <h1 className="text-xl font-semibold">Hệ thống quản lý ca trực</h1>

      <div className="flex items-center gap-4">
        {/* Chọn ca khi chưa có ca làm việc */}
        {canChooseShift && !selectedShift && (
          <select
            value={selectedShift}
            onChange={handleShiftSelect}
            className="text-black px-2 py-1 rounded"
          >
            <option value="">Chọn ca</option>
            {['T1', 'T2', 'T3', 'H1', 'H2', 'V1', 'V2'].map(ca => (
              <option key={ca} value={ca}>{ca}</option>
            ))}
          </select>
        )}

        {/* Thay đổi ca khi đã có ca làm việc */}
        {selectedShift && (
          <select
            value={selectedShift}
            onChange={handleShiftSelect}
            className="text-black px-2 py-1 rounded"
          >
            <option value="">Thay đổi ca</option>
            {['T1', 'T2', 'T3', 'H1', 'H2', 'V1', 'V2'].map(ca => (
              <option key={ca} value={ca}>{ca}</option>
            ))}
          </select>
        )}

        <div className="relative">
          <button onClick={handleLogout} className="px-4 py-2 bg-white text-blue-600 rounded-full">
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
