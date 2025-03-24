import dotenv from 'dotenv';
import sequelize from '../config/database.js';
import User from '../models/User.js';
import { seedUsers } from './seedUsers.js';

dotenv.config();

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');
    await sequelize.sync({ alter: true });
    await seedUsers();
    console.log('🌱 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

run();
