"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          unique: { msg: `Email address already in use` },
        },
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      nama: {
        type: Sequelize.STRING,
      },
      alamat: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      discountStatus: {
        type: Sequelize.BOOLEAN,
      },
      discount: {
        type: Sequelize.INTEGER,
      },
      referral: {
        type: Sequelize.STRING,
      },
      referralStatus: {
        type: Sequelize.BOOLEAN,
      },
      bank: {
        type: Sequelize.STRING,
      },
      noRekening: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      noKtp: {
        type: Sequelize.STRING,
      },
      noNPWP: {
        type: Sequelize.STRING,
      },
      totalPembelian: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Users");
  },
};
