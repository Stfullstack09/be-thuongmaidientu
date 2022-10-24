'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Allcode.hasMany(models.Product, { foreignKey: 'categoryId', as: 'categoryData' });
            Allcode.hasMany(models.Cart, { foreignKey: 'size', as: 'sizeData' });
            Allcode.hasMany(models.User, {
                foreignKey: 'address',
                as: 'addressData',
            });
            Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
        }
    }
    Allcode.init(
        {
            keyMap: DataTypes.STRING,
            type: DataTypes.STRING,
            valueVI: DataTypes.STRING,
            valueEN: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Allcode',
        },
    );
    return Allcode;
};
