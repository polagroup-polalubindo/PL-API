'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MachineRegister extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MachineRegister.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  MachineRegister.init({
    noMachine: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    purchaseDate: DataTypes.DATE,
    purchasePlace: DataTypes.STRING,
    noInvoice: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MachineRegister',
  });
  return MachineRegister;
};