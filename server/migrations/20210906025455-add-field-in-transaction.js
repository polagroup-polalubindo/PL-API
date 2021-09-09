'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Transaksis', 'voucher1', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Voucher'
        }
      }),
      queryInterface.addColumn('Transaksis', 'voucher2', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Voucher'
        }
      }),
      queryInterface.addColumn('Transaksis', 'potonganHarga', Sequelize.INTEGER),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Transaksis', 'voucher1'),
      queryInterface.removeColumn('Transaksis', 'voucher2'),
      queryInterface.removeColumn('Transaksis', 'potonganHarga'),
    ])
  }
};
