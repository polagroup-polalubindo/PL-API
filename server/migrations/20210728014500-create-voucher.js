'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      periodeStart: {
        type: Sequelize.DATE
      },
      periodeEnd: {
        type: Sequelize.DATE
      },
      typeVoucher: {
        type: Sequelize.STRING
      },
      discountMax: {
        type: Sequelize.INTEGER
      },
      minimumPurchase: {
        type: Sequelize.INTEGER
      },
      usageQuota: {
        type: Sequelize.INTEGER
      },
      forAll: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Vouchers');
  }
};