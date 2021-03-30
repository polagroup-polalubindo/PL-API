'use strict';
const {
  Model
} = require('sequelize');
const bycrpt = require('bcryptjs');
const { genSaltSync } = require('bcrypt');
const shortid = require('shortid')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Produk,{through:models.Cart})
      User.hasMany(models.Cart)
      User.hasMany(models.Komisi)
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        notEmpty:true
      }
    },
    nama: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true,
      },
    },
    role: DataTypes.STRING,
    referral: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    discountStatus: DataTypes.BOOLEAN,
    discount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user,option)=>{
    user.role = 'customer'
    user.status = true
    user.discountStatus = false
    user.password = user.phone
    user.referral = shortid.generate()

    const salt = genSaltSync(10)
    user.password = bycrpt.hashSync(user.password , salt)
  })

  User.afterUpdate((user,option)=>{
    console.log('after edit')
    const salt = genSaltSync(10)
    user.password = bycrpt.hashSync(user.password , salt)
  })
  return User;
};