'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Produks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaProduk: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.STRING
      },
      fotoProduk: {
        type: Sequelize.STRING
      },
      videoProduk: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.INTEGER
      },
      statusProduk: {
        type: Sequelize.BOOLEAN
      },
      sku: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.INTEGER
      },
      panjang: {
        type: Sequelize.INTEGER
      },
      lebar: {
        type: Sequelize.INTEGER
      },
      tinggi: {
        type: Sequelize.INTEGER
      },
      komisi: {
        type: Sequelize.INTEGER
      },
      komisiProduk: {
        type: Sequelize.BOOLEAN
      },
      price: {
        type: Sequelize.INTEGER
      },
      brandId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Produks');
  }
};