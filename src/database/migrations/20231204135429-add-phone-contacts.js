/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('contacts', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('contacts', 'phone', { transaction });
    }),
};
