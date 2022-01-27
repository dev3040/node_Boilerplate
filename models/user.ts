'use strict';
import {
  Model
}  from 'sequelize';

interface UserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber:string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}

module.exports = (sequelize:any, DataTypes:any) => {
  class User extends Model <UserAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models:any) {
      // define association here
    }
  };
  User.init({
    firstName:{
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName:{
      type:DataTypes.STRING,
      allowNull: false
    },
    email:{
      type:DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpire:{
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};