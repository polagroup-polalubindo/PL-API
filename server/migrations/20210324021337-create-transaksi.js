"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transaksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invoice: {
        type: Sequelize.STRING,
      },
      totalHarga: {
        type: Sequelize.INTEGER,
      },
      ongkosKirim: {
        type: Sequelize.INTEGER,
      },
      statusPesanan: {
        type: Sequelize.STRING,
      },
      statusPembayaran: {
        type: Sequelize.STRING,
      },
      statusPengiriman: {
        type: Sequelize.STRING,
      },
      metodePembayaran: {
        type: Sequelize.STRING,
      },
      namaRekening: {
        type: Sequelize.STRING,
      },
      jumlahBayar: {
        type: Sequelize.INTEGER,
      },
      bankAsal: {
        type: Sequelize.STRING,
      },
      bankTujuan: {
        type: Sequelize.STRING,
      },
      namaPenerima: {
        type: Sequelize.STRING,
      },
      alamatPengiriman: {
        type: Sequelize.STRING,
      },
      telfonPenerima: {
        type: Sequelize.STRING,
      },
      referralCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Transaksis");
  },
};
