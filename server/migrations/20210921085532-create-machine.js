'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Machines', {
      noMachine: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      purchaseDate: {
        type: Sequelize.DATE
      },
      invoice: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Machines');
  }
};