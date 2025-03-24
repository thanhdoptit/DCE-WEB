const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Gửi yêu cầu đăng nhập đến backend
      const response = await authService.login(username, password);
      const role = response.user.role.toLowerCase();
  
      // Lưu thông tin vào localStorage
      localStorage.setItem('user', JSON.stringify(response.user));  // Lưu toàn bộ thông tin người dùng
      localStorage.setItem('token', response.token);  // Lưu token để xác thực
      localStorage.setItem('selectedShift', response.user.selectedShift);  // Lưu shiftCode (ca làm việc)
      localStorage.setItem('shiftId', response.user.shiftId);  // Lưu shiftId
  
      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!');
  
      // Chuyển hướng dựa trên role của người dùng
      switch (role) {
        case 'admin':
          navigate('/admin/work-sessions');
          break;
        case 'dc':
          navigate('/dc/work-sessions');
          break;
        case 'manager':
          navigate('/manager/work-sessions');
          break;
        case 'be':
          navigate('/be/work-sessions');
          break;
        default:
          navigate('/user/work-sessions');
      }
    } catch (error) {
      const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  