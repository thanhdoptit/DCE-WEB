import bcrypt from 'bcrypt';
import db from '../models/index.js';
const { User } = db;

export const seedUsers = async () => {
  const defaultUsers = [
    {
      username: 'admin',
      fullname: 'Administrator',
      role: 'admin',
      isADUser: false
    },
    {
      username: 'dcuser',
      fullname: 'Data Center User',
      role: 'Datacenter',
      isADUser: false
    },
    {
      username: 'beuser',
      fullname: 'Backend Engineer',
      role: 'BE',
      isADUser: false
    },
    {
      username: 'manager',
      fullname: 'Manager Person',
      role: 'Manager',
      isADUser: false
    },
    {
      username: 'dce1',
      fullname: 'DCE User 1',
      role: 'Datacenter',
      isADUser: false
    },
    {
      username: 'dce2',
      fullname: 'DCE User 2',
      role: 'Datacenter',
      isADUser: false
    },
    {
      username: 'dce3',
      fullname: 'DCE User 3',
      role: 'Datacenter',
      isADUser: false
    }
  ];

  const passwordHash = await bcrypt.hash('123456', 10);

  for (const user of defaultUsers) {
    const existing = await User.findOne({ where: { username: user.username } });
    if (!existing) {
      await User.create({ ...user, password: passwordHash });
      console.log(`✅ Created user: ${user.username}`);
    } else {
      console.log(`ℹ️ User ${user.username} already exists`);
    }
  }
};
