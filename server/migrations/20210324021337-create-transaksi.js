'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice: {
        type: Sequelize.STRING
      },
      statusPembayaran: {
        type: Sequelize.BOOLEAN
      },
      statusPengiriman: {
        type: Sequelize.BOOLEAN
      },
      metodePembayaran: {
        type: Sequelize.STRING
      },
      namaRekening: {
        type: Sequelize.STRING
      },
      jumlahBayar: {
        type: Sequelize.INTEGER
      },
      bankAsal: {
        type: Sequelize.STRING
      },
      bankTujuan: {
        type: Sequelize.STRING
      },
      namaPenerima: {
        type: Sequelize.STRING
      },
      alamatPengiriman:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transaksis');
  }
};