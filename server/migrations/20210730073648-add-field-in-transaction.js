'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Transaksis', 'orderNo', Sequelize.STRING),
      queryInterface.addColumn('Transaksis', 'itemName', Sequelize.STRING),
      queryInterface.addColumn('Transaksis', 'itemQuantity', Sequelize.INTEGER),
      queryInterface.addColumn('Transaksis', 'weight', Sequelize.STRING),
      queryInterface.addColumn('Transaksis', 'expressType', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Transaksis', 'orderNo'),
      queryInterface.removeColumn('Transaksis', 'itemName'),
      queryInterface.removeColumn('Transaksis', 'itemQuantity'),
      queryInterface.removeColumn('Transaksis', 'weight'),
      queryInterface.removeColumn('Transaksis', 'expressType'),
    ])
  }
};
