'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('Alamats', 'kecamatan'),
      queryInterface.addColumn('Alamats', 'detail', Sequelize.STRING),
      queryInterface.addColumn('Alamats', 'kecamatanId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'District'
        },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('Alamats', 'kotaId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'City'
        },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('Alamats', 'provinsiId', {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Province'
        },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('Alamats', 'keterangan', Sequelize.STRING),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Alamats', 'kecamatan', Sequelize.STRING),
      queryInterface.removeColumn('Alamats', 'detail'),
      queryInterface.removeColumn('Alamats', 'kecamatanId'),
      queryInterface.removeColumn('Alamats', 'kotaId'),
      queryInterface.removeColumn('Alamats', 'provinsiId'),
      queryInterface.removeColumn('Alamats', 'keterangan'),
    ])
  }
};
