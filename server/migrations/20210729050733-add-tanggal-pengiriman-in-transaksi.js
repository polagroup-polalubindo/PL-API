'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transaksis', 'tanggalPengiriman', Sequelize.DATE)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Transaksis', 'tanggalPengiriman')

  }
};
