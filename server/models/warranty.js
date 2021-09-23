'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warranty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warranty.belongsTo(models.User, { foreignKey: 'userId' })
      Warranty.belongsTo(models.Machine, { foreignKey: 'noMachine' })
    }
  };
  Warranty.init({
    noMachine: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    purchaseDate: DataTypes.DATE,
    purchasePlace: DataTypes.STRING,
    invoice: DataTypes.STRING,
    hasClaim: DataTypes.BOOLEAN,
    isValid: DataTypes.BOOLEAN,
    claim: DataTypes.STRING,
    issue: DataTypes.STRING,
    claimDate: DataTypes.DATE,
    statusClaim: DataTypes.STRING, // Belum diklaim, Pengajuan, Sedang diproses, Sudah diklaim
  }, {
    sequelize,
    modelName: 'Warranty',
  });
  return Warranty;
};