import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(username, password);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast.success('Đăng nhập thành công!');
      const role = data.user.role.toLowerCase();

      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'dc':
          navigate('/dc');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'be':
          navigate('/be');
          break;
        default:
          navigate('/user');
      }
    } catch (err) {
      toast.error(err.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundImage: "url('/src/assets/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {/* Header */}
      <div className="bg-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h1 className="text-2xl font-bold text-blue-900">DCE</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Đăng nhập hệ thống
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                  Tên đăng nhập
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Quên mật khẩu?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
