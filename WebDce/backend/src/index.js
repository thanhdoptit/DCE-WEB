import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import sequelize from './config/database.js';
import User from './models/User.js';
import userRoutes from './routes/userRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
sequelize.sync({ after: true }).then(() => {
    console.log('✅ Database synced');
  }).catch((err) => {
    console.error('❌ DB sync error:', err);
  });