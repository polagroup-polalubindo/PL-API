'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Transaksis', 'recipientProvinceId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Province'
        }
      }),
      queryInterface.addColumn('Transaksis', 'recipientCityId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'City'
        }
      }),
      queryInterface.addColumn('Transaksis', 'recipientDistrictId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'District'
        }
      }),
      queryInterface.addColumn('Transaksis', 'recipientAddress', Sequelize.STRING),
      queryInterface.addColumn('Transaksis', 'recipientZipCode', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Transaksis', 'recipientProvinceId'),
      queryInterface.removeColumn('Transaksis', 'recipientCityId'),
      queryInterface.removeColumn('Transaksis', 'recipientDistrictId'),
      queryInterface.removeColumn('Transaksis', 'recipientAddress'),
      queryInterface.removeColumn('Transaksis', 'recipientZipCode'),
    ])
  }
};
