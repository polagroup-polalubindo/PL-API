'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Vouchers', 'banner', Sequelize.STRING),
      queryInterface.addColumn('Vouchers', 'nominal', Sequelize.INTEGER),
      queryInterface.addColumn('Vouchers', 'keterangan', Sequelize.STRING),
      queryInterface.addColumn('Vouchers', 'canCombine', Sequelize.BOOLEAN),
      queryInterface.addColumn('Vouchers', 'isUnlimited', Sequelize.BOOLEAN),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Vouchers', 'banner'),
      queryInterface.removeColumn('Vouchers', 'nominal'),
      queryInterface.removeColumn('Vouchers', 'keterangan'),
      queryInterface.removeColumn('Vouchers', 'canCombine'),
      queryInterface.removeColumn('Vouchers', 'isUnlimited'),
    ])
  }
};
