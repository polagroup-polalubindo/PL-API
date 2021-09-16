'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Warranties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      noMachine: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      purchaseDate: {
        type: Sequelize.DATE
      },
      purchasePlace: {
        type: Sequelize.STRING
      },
      invoice: {
        type: Sequelize.STRING
      },
      hasClaim: {
        type: Sequelize.BOOLEAN
      },
      isValid: {
        type: Sequelize.BOOLEAN
      },
      claim: {
        type: Sequelize.STRING
      },
      issue: {
        type: Sequelize.STRING
      },
      claimDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Warranties');
  }
};