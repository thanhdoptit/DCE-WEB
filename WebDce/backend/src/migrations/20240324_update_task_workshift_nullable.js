export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('Tasks', 'workShiftId', {
    type: Sequelize.INTEGER,
    allowNull: true
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('Tasks', 'workShiftId', {
    type: Sequelize.INTEGER,
    allowNull: false
  });
} 