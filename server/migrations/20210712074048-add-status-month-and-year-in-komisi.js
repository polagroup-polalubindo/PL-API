'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Komisis', 'month', Sequelize.STRING(5)),
      queryInterface.addColumn('Komisis', 'year', Sequelize.STRING(10)),
      queryInterface.addColumn('Komisis', 'status', Sequelize.STRING(150)),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Komisis', 'month'),
      queryInterface.removeColumn('Komisis', 'year'),
      queryInterface.removeColumn('Komisis', 'status'),
    ])
  }
};
