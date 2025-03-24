import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    fullName: '',
    description: '',
    checkInTime: new Date().toISOString().slice(0, 16),
    checkOutTime: '',
    attachments: []
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/tasks/shift/10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(response.data.tasks);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách công việc');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewTask({
      ...newTask,
      attachments: files
    });
  };

  // Handle create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('fullName', newTask.fullName);
      formData.append('description', newTask.description);
      formData.append('checkInTime', newTask.checkInTime);
      if (newTask.checkOutTime) {
        formData.append('checkOutTime', newTask.checkOutTime);
      }
      
      // Append multiple files with original names
      newTask.attachments.forEach(file => {
        formData.append('attachments', file, file.name);
      });

      await axios.post(`${API_URL}/api/tasks`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowCreateModal(false);
      setNewTask({ 
        fullName: '', 
        description: '', 
        checkInTime: new Date().toISOString().slice(0, 16),
        checkOutTime: '',
        attachments: [] 
      });
      fetchTasks();
    } catch (err) {
      setError('Không thể tạo công việc mới');
      console.error('Error creating task:', err);
    }
  };

  // Handle complete task
  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.patch(`${API_URL}/api/tasks/${taskId}/status`, 
        {
          status: 'done'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      fetchTasks();
    } catch (err) {
      setError('Không thể cập nhật trạng thái công việc');
      console.error('Error completing task:', err);
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách công việc</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-sm"
        >
          Tạo công việc mới
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">STT</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên nhân sự</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian vào</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian ra</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Công việc thực hiện</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cán bộ Vận Hành TTDL</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">File đính kèm</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task, index) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{task.fullName}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(task.checkInTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {task.checkOutTime ? format(new Date(task.checkOutTime), 'dd/MM/yyyy HH:mm', { locale: vi }) : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{task.description}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{task.User?.fullname || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {task.attachments && task.attachments.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {task.attachments.map((filename, idx) => (
                        <a
                          key={idx}
                          href={`${API_URL}/uploads/${filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {filename}
                        </a>
                      ))}
                    </div>
                  ) : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status === 'done' ? 'Hoàn thành' : 'Đang làm'}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {task.status !== 'done' && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 shadow-sm"
                    >
                      Hoàn thành
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tạo công việc mới</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên nhân sự
                </label>
                <input
                  type="text"
                  value={newTask.fullName}
                  onChange={(e) => setNewTask({ ...newTask, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian vào
                </label>
                <input
                  type="datetime-local"
                  value={newTask.checkInTime}
                  onChange={(e) => setNewTask({ ...newTask, checkInTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian ra
                </label>
                <input
                  type="datetime-local"
                  value={newTask.checkOutTime}
                  onChange={(e) => setNewTask({ ...newTask, checkOutTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Công việc thực hiện
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File đính kèm
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm"
                    multiple
                  />
                </div>
                {newTask.attachments.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 space-y-1">
                      {Array.from(newTask.attachments).map((file, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-sm"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
