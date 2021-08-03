'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
     queryInterface.addColumn('Transaksis', 'insurance', Sequelize.BOOLEAN),
     queryInterface.addColumn('Transaksis', 'insuranceFee', Sequelize.INTEGER)
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Transaksis', 'insurance'),
      queryInterface.removeColumn('Transaksis', 'insuranceFee')
     ])
  }
};
