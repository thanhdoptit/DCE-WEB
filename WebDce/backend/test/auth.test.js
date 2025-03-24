import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'dce1',
      password: '123456'
    });
    
    console.log('✅ Login Success:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('❌ Login Error:', error.response?.data || error.message);
    return null;
  }
}

// Chạy test login
testLogin(); 