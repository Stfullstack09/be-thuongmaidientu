'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Oder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Oder.init(
        {
            userId: DataTypes.INTEGER,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            address: DataTypes.STRING,
            note: DataTypes.STRING,
            totalMoney: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Oder',
        },
    );
    return Oder;
};
