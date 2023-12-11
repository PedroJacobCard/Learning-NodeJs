/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'ARCHIVED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('users', 'status', { transaction });
    }),
};
