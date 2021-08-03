'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Provinces', [
      { id: 1, name: 'DKI JAKARTA', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'BANTEN', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'JAWA BARAT', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'JAWA TENGAH', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'DI YOGYAKARTA', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'JAWA TIMUR', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'BENGKULU', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'D.I. ACEH', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'JAMBI', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'KEP. BANGKA BELITUNG', createdAt: new Date(), updatedAt: new Date() },
      { id: 11, name: 'KEP. RIAU', createdAt: new Date(), updatedAt: new Date() },
      { id: 12, name: 'LAMPUNG', createdAt: new Date(), updatedAt: new Date() },
      { id: 13, name: 'RIAU', createdAt: new Date(), updatedAt: new Date() },
      { id: 14, name: 'SUMATERA BARAT', createdAt: new Date(), updatedAt: new Date() },
      { id: 15, name: 'SUMATERA SELATAN', createdAt: new Date(), updatedAt: new Date() },
      { id: 16, name: 'SUMATERA UTARA', createdAt: new Date(), updatedAt: new Date() },
      { id: 17, name: 'KALIMANTAN BARAT', createdAt: new Date(), updatedAt: new Date() },
      { id: 18, name: 'KALIMANTAN SELATAN', createdAt: new Date(), updatedAt: new Date() },
      { id: 19, name: 'KALIMANTAN TENGAH', createdAt: new Date(), updatedAt: new Date() },
      { id: 20, name: 'KALIMANTAN TIMUR', createdAt: new Date(), updatedAt: new Date() },
      { id: 21, name: 'KALIMANTAN UTARA', createdAt: new Date(), updatedAt: new Date() },
      { id: 22, name: 'GORONTALO', createdAt: new Date(), updatedAt: new Date() },
      { id: 23, name: 'SULAWESI BARAT', createdAt: new Date(), updatedAt: new Date() },
      { id: 24, name: 'SULAWESI SELATAN', createdAt: new Date(), updatedAt: new Date() },
      { id: 25, name: 'SULAWESI TENGAH', createdAt: new Date(), updatedAt: new Date() },
      { id: 26, name: 'SULAWESI TENGGARA', createdAt: new Date(), updatedAt: new Date() },
      { id: 27, name: 'SULAWESI UTARA', createdAt: new Date(), updatedAt: new Date() },
      { id: 28, name: 'BALI', createdAt: new Date(), updatedAt: new Date() },
      { id: 29, name: 'NTB', createdAt: new Date(), updatedAt: new Date() },
      { id: 30, name: 'NTT', createdAt: new Date(), updatedAt: new Date() },
      { id: 31, name: 'MALUKU', createdAt: new Date(), updatedAt: new Date() },
      { id: 32, name: 'MALUKU UTARA', createdAt: new Date(), updatedAt: new Date() },
      { id: 33, name: 'PAPUA', createdAt: new Date(), updatedAt: new Date() },
      { id: 34, name: 'PAPUA BARAT', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Province', null, {});
  }
};
