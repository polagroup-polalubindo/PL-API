'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'namaRekening', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('Users', 'namaRekening');
    }
};
