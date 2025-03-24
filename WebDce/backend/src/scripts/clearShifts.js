import db from '../models/index.js';
const { WorkShift, UserShift } = db;

const clearShifts = async () => {
  try {
    // Xóa tất cả bản ghi trong UserShift trước
    await UserShift.destroy({
      where: {},
      force: true
    });
    console.log('✅ Đã xóa tất cả dữ liệu từ bảng UserShift');

    // Sau đó xóa tất cả bản ghi trong WorkShift
    await WorkShift.destroy({
      where: {},
      force: true
    });
    console.log('✅ Đã xóa tất cả dữ liệu từ bảng WorkShift');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
    process.exit(1);
  }
};

clearShifts(); 