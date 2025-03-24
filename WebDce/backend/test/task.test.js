import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQyODEwNDA4LCJleHAiOjE3NDI4OTY4MDh9.aDERmvXg1pZfxuIUboCyqUh_uWcZKpvx-J469dyWHMA';

const headers = {
  Authorization: `Bearer ${TOKEN}`
};

let createdTaskId = null;

async function testCreateTask() {
  console.log('\n🔍 Testing POST /api/tasks');
  const formData = new FormData();
  formData.append('fullName', 'Test Task');
  formData.append('checkInTime', new Date().toISOString());
  formData.append('description', 'Test Description');

  // Thêm file đính kèm
  const filePath = path.join(process.cwd(), 'test', 'test.txt');
  console.log('📎 Attaching file:', filePath);
  formData.append('attachment', fs.createReadStream(filePath));

  try {
    const response = await axios.post(`${API_URL}/tasks`, formData, {
      headers: {
        ...headers,
        ...formData.getHeaders()
      }
    });
    console.log('✅ Create Task Success:', response.data);
    createdTaskId = response.data.id;
  } catch (error) {
    console.error('❌ Create Task Error:', error.response?.data || error.message);
    console.error('Error details:', error.response?.data || error.message);
  }
}

async function testGetTask() {
  if (!createdTaskId) {
    console.log('⚠️ Skipping get task test - no task created');
    return;
  }

  console.log('\n🔍 Testing GET /api/tasks/:id');
  try {
    const response = await axios.get(`${API_URL}/tasks/${createdTaskId}`, { headers });
    console.log('✅ Get Task Success:', response.data);
  } catch (error) {
    console.error('❌ Get Task Error:', error.response?.data || error.message);
  }
}

async function testGetTasksByShift() {
  console.log('\n🔍 Testing GET /api/tasks/shift/:shiftId');
  try {
    const response = await axios.get(`${API_URL}/tasks/shift/10`, { headers });
    console.log('✅ Get Tasks By Shift Success:', response.data);
  } catch (error) {
    console.error('❌ Get Tasks By Shift Error:', error.response?.data || error.message);
  }
}

async function testUpdateTask() {
  if (!createdTaskId) {
    console.log('⚠️ Skipping update task test - no task created');
    return;
  }

  console.log('\n🔍 Testing PUT /api/tasks/:id');
  const formData = new FormData();
  formData.append('fullName', 'Updated Task');
  formData.append('checkInTime', new Date().toISOString());
  formData.append('description', 'Updated Description');
  formData.append('status', 'done');

  try {
    const response = await axios.put(`${API_URL}/tasks/${createdTaskId}`, formData, {
      headers: {
        ...headers,
        ...formData.getHeaders()
      }
    });
    console.log('✅ Update Task Success:', response.data);
  } catch (error) {
    console.error('❌ Update Task Error:', error.response?.data || error.message);
  }
}

async function testDeleteTask() {
  if (!createdTaskId) {
    console.log('⚠️ Skipping delete task test - no task created');
    return;
  }

  console.log('\n🔍 Testing DELETE /api/tasks/:id');
  try {
    const response = await axios.delete(`${API_URL}/tasks/${createdTaskId}`, { headers });
    console.log('✅ Delete Task Success:', response.data);
  } catch (error) {
    console.error('❌ Delete Task Error:', error.response?.data || error.message);
  }
}

async function testUploadMultipleFiles() {
  console.log('\n🔍 Testing POST /api/tasks/multi');
  const formData = new FormData();
  const filePath = path.join(process.cwd(), 'test', 'test.txt');
  formData.append('files', fs.createReadStream(filePath));

  try {
    const response = await axios.post(`${API_URL}/tasks/multi`, formData, {
      headers: {
        ...headers,
        ...formData.getHeaders()
      }
    });
    console.log('✅ Upload Multiple Files Success:', response.data);
  } catch (error) {
    console.error('❌ Upload Multiple Files Error:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Task API Tests...\n');
  
  await testCreateTask();
  await testGetTask();
  await testGetTasksByShift();
  await testUpdateTask();
  await testUploadMultipleFiles();
  await testDeleteTask();

  console.log('\n✨ All tests completed!');
}

runTests(); 