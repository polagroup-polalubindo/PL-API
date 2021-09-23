'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Machine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Machine.hasOne(models.Warranty, { foreignKey: 'noMachine' })
    }
  };
  Machine.init({
    noMachine: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    purchaseDate: DataTypes.DATE,
    invoice: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Machine',
  });



  return Machine;
};