import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';
let token = '';

async function login() {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'dcuser',
      password: '123456'
    })
  });
  const data = await res.json();
  token = data.token;
  console.log('✅ Login successful, token:', token);
}

async function getCurrentShift() {
  console.log('\n🔍 Testing GET /api/shifts/user');
  const res = await fetch(`${API_URL}/api/shifts/user`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Response:', data);
}

async function selectShift() {
  console.log('\n🔍 Testing PUT /api/shifts/select');
  const res = await fetch(`${API_URL}/api/shifts/select`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shiftCode: 'T1' })
  });
  const data = await res.json();
  console.log('Response:', data);
}

async function changeShift() {
  console.log('\n🔍 Testing PUT /api/shifts/change');
  const res = await fetch(`${API_URL}/api/shifts/change`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shiftCode: 'T2' })
  });
  const data = await res.json();
  console.log('Response:', data);
}

async function getAllShifts() {
  console.log('\n🔍 Testing GET /api/shifts/all');
  const res = await fetch(`${API_URL}/api/shifts/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Response:', data);
}

async function getTodayAvailableShifts() {
  console.log('\n🔍 Testing GET /api/shifts/today-available');
  const res = await fetch(`${API_URL}/api/shifts/today-available`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Response:', data);
}

async function runTests() {
  try {
    await login();
    await getCurrentShift();
    await selectShift();
    await getCurrentShift();
    await changeShift();
    await getCurrentShift();
    await getAllShifts();
    await getTodayAvailableShifts();
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

runTests(); 