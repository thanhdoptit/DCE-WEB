import db from '../models/index.js';
const { WorkShift } = db;

export const seedWorkShifts = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const defaultShifts = [
    {
      name: 'T1',
      code: 'T1',
      date: today,
      status: 'doing',
      createdBy: 1 // admin user id
    },
    {
      name: 'T2',
      code: 'T2',
      date: today,
      status: 'doing',
      createdBy: 1
    },
    {
      name: 'T3',
      code: 'T3',
      date: today,
      status: 'doing',
      createdBy: 1
    }
  ];
  
  // Xóa các ca cũ của ngày hôm nay
  await WorkShift.destroy({
    where: { date: today }
  });
  console.log('🗑️ Deleted old shifts for today');

  // Tạo các ca mới
  for (const shift of defaultShifts) {
    await WorkShift.create(shift);
    console.log(`✅ Created shift: ${shift.name}`);
  }
}; 