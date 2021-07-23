'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Produks', 'komisiLevel1', Sequelize.INTEGER(100)),
      queryInterface.addColumn('Produks', 'komisiLevel2', Sequelize.INTEGER(100)),
      queryInterface.addColumn('Produks', 'komisiLevel3', Sequelize.INTEGER(100)),
      queryInterface.addColumn('Produks', 'TDS', Sequelize.STRING),
      queryInterface.addColumn('Produks', 'MSDS', Sequelize.STRING),
      queryInterface.addColumn('Produks', 'asuransiPengiriman', Sequelize.STRING(100)),
      queryInterface.addColumn('Produks', 'layananPengiriman', Sequelize.STRING(100)),
      queryInterface.addColumn('Produks', 'preorder', Sequelize.BOOLEAN),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Produks', 'komisi1'),
      queryInterface.removeColumn('Produks', 'komisi2'),
      queryInterface.removeColumn('Produks', 'komisi3'),
      queryInterface.removeColumn('Produks', 'TDS'),
      queryInterface.removeColumn('Produks', 'MSDS'),
      queryInterface.removeColumn('Produks', 'asuransiPengiriman'),
      queryInterface.removeColumn('Produks', 'layananPengiriman'),
      queryInterface.removeColumn('Produks', 'preorder'),
    ])
  }
};
