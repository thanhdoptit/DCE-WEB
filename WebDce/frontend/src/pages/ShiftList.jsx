import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export default function ShiftList() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/shifts/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shifts');
      }

      const data = await response.json();
      setShifts(data);
    } catch (error) {
      toast.error('Không thể tải danh sách ca làm việc');
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserCell = (shift) => {
    const currentUsers = shift.Users?.map(u => u.fullname) || [];
    const historicalUsers = (shift.workedUsers || []).map(u => u.fullname);
    
    // Lọc ra những người đã làm việc nhưng không còn trong ca hiện tại
    const pastUsers = historicalUsers.filter(u => !currentUsers.includes(u));

    if (currentUsers.length === 0 && pastUsers.length === 0) {
      return <span className="text-gray-500">Chưa phân công</span>;
    }

    return (
      <div className="space-y-2">
        {currentUsers.length > 0 && (
          <div>
            <span className="font-medium text-green-600">Đang làm việc: </span>
            <span>{currentUsers.join(', ')}</span>
          </div>
        )}
        {pastUsers.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Đã tham gia: </span>
            <span>{pastUsers.join(', ')}</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách ca làm việc</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-6 py-4 whitespace-nowrap">{shift.code}</td>
                <td className="px-6 py-4">{renderUserCell(shift)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(shift.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    shift.status === 'doing' ? 'bg-green-100 text-green-800' : 
                    shift.status === 'handover' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {shift.status === 'doing' ? 'Đang làm việc' :
                     shift.status === 'handover' ? 'Đang bàn giao' :
                     'Đã kết thúc'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
